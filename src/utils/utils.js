import axios from 'axios'

// soildata:
// soil moisture and drainage characteristics for different levels of soil water capacity
const modeldata = {
  cropinfo: {
    grass: {
      Lini: 0,
      Ldev: 0,
      Lmid: 240,
      Llate: 0,
      Kcini: 1.0,
      Kcmid: 1.0,
      Kcend: 1.0,
    },
  },
  soildata: {
    soilmoistureoptions: {
      low: {
        wiltingpoint: 1.0,
        prewiltingpoint: 1.15,
        stressthreshold: 1.5,
        fieldcapacity: 2.0,
        saturation: 5.0,
      },
      medium: {
        wiltingpoint: 2.0 / 3,
        prewiltingpoint: 2.225 / 3,
        stressthreshold: 2.8 / 3,
        fieldcapacity: 3.5 / 3,
        saturation: 5.5 / 3,
      },
      high: {
        wiltingpoint: 3.0,
        prewiltingpoint: 3.3,
        stressthreshold: 4.0,
        fieldcapacity: 5.0,
        saturation: 6.5,
      },
    },
    soildrainageoptions: {
      low: {daysToDrainToFcFromSat: 0.125},
      medium: {daysToDrainToFcFromSat: 1.0},
      high: {daysToDrainToFcFromSat: 2.0},
    },
  },
}
const {medium} = modeldata.soildata.soilmoistureoptions

// const noDeficit = medium.saturation - medium.fieldcapacity;
const deficitNoStress = medium.stressthreshold - medium.fieldcapacity
const deficitStress = medium.prewiltingpoint - medium.fieldcapacity
// const severeStress = medium.wiltingpoint - medium.fieldcapacity;

// console.log(noDeficit);
// console.log(deficitNoStress);
// console.log(deficitStress);
// console.log(severeStress);

export const determineColor = deficit => {
  if (deficit >= 0) {
    return '#2E933C'
  }
  if (deficit >= deficitNoStress && deficit < 0) {
    return '#F9DC5C'
  }

  if (deficit >= deficitStress && deficit < deficitNoStress) {
    return '#FC9E4F'
  }

  if (deficit < deficitStress) {
    return '#BA2D0B'
  }
}

const getPotentialDailyDrainage = soilcap => {
  // -----------------------------------------------------------------------------------------
  // Calculate potential daily drainage of soil
  //
  // soilcap : soil water capacity : string ('high', 'medium', 'low')
  // -----------------------------------------------------------------------------------------
  return (
    (modeldata.soildata.soilmoistureoptions[soilcap].saturation -
      modeldata.soildata.soilmoistureoptions[soilcap].fieldcapacity) /
    modeldata.soildata.soildrainageoptions[soilcap].daysToDrainToFcFromSat
  )
}

const getTawForPlant = soilcap => {
  // -----------------------------------------------------------------------------------------
  // Calculate total available water (TAW) for plant, defined here as:
  // soil moisture at field capacity minus soil moisture at wilting point
  //
  // soilcap : soil water capacity : string ('high', 'medium', 'low')
  // -----------------------------------------------------------------------------------------
  return (
    modeldata.soildata.soilmoistureoptions[soilcap].fieldcapacity -
    modeldata.soildata.soilmoistureoptions[soilcap].wiltingpoint
  )
}

const getWaterStressCoeff = (Dr, TAW) => {
  // -----------------------------------------------------------------------------------------
  // Calculate coefficient for adjusting ET when accounting for decreased ET during water stress conditions.
  // Refer to FAO-56 eq 84, pg 169
  // Dr  : the antecedent water deficit (in)
  // TAW : total available (in) water for the plant (soil moisture at field capacity minus soil moisture at wilting point).
  // p   : at what fraction between field capacity and wilting point do we start applying this water stress factor.
  // Ks  : water stress coefficient
  // -----------------------------------------------------------------------------------------
  let Ks = null
  const p = 0.5
  Dr = -1 * Dr
  Ks = Dr <= p * TAW ? 1 : (TAW - Dr) / ((1 - p) * TAW)
  Ks = Math.max(Ks, 0)
  return Ks
}

export const getPET = (sdate, lat, lon, soilCapacity, initDeficit) => {
  // console.log("getPET CALLED!", sdate, lat, lon, soilCapacity, initDeficit);
  const year = new Date(sdate).getFullYear().toString()
  const latitude = lat.toFixed(4)
  const longitude = lon.toFixed(4)
  // the first date is 03/01
  const url = `${
    process.env.REACT_APP_PROXYIRRIGATION
  }?lat=${latitude}&lon=${longitude}&year=${year}`
  // console.log(url);
  return axios
    .get(url)
    .then(res => {
      // console.log(`BrianCALL`, res.data);
      const dates = [...res.data.dates_precip, ...res.data.dates_precip_fcst]
      const pcpns = [...res.data.precip, ...res.data.precip_fcst]
      const pets = [...res.data.pet, ...res.data.pet_fcst]
      const results = runWaterDeficitModel(
        pcpns,
        pets,
        initDeficit,
        soilCapacity,
        0,
        0,
      )

      const data = results.deficitDaily.map((val, i) => {
        let p = {}
        p.date = `${dates[i]}/${year}`
        p.deficit = +val.toFixed(2)
        p.pet = pets[i]
        p.pcp = pcpns[i]
        return p
      })

      // console.log(data);
      return data
    })
    .catch(err => {
      console.log('Failed to fetch PET data', err)
    })
}

export const runWaterDeficitModel = (
  precip,
  pet,
  initDeficit,
  soilcap,
  deficitAdjustment,
  todayIdx,
) => {
  // console.log(precip, pet, initDeficit, soilcap);
  // -----------------------------------------------------------------------------------------
  // Calculate daily water deficit (inches) from daily precipitation, evapotranspiration, soil drainage and runoff.
  //
  // The water deficit is calculated relative to field capacity (i.e. the amount of water available to the plant).
  // Therefore, the water deficit is:
  //    - zero when soil moisture is at field capacity
  //    - a negative value when soil moisture is between field capacity and the wilting point
  //    - a positive value when soil moisture is between field capacity and saturation
  //    - bounded below by the wilting point ( = soil moisture at wilting point minus soil moisture at field capacity )
  //    - bounded above by saturation ( = soil moisture at saturation minus soil moisture at field capacity)
  //
  //  precip       : daily precipitation array (in) : (NRCC ACIS grid 3)
  //  pet          : daily potential evapotranspiration array (in) : (grass reference PET obtained from NRCC MORECS model output)
  //  initDeficit  : water deficit used to initialize the model
  //  startDate    : date of model initialization     ** removed for this implementation -kle
  //  plantingDate : date crop was planted            ** removed for this implementation -kle
  //  soilcap      : soil water capacity ('high','medium','low')
  //  croptype     : type of crop
  //
  // -----------------------------------------------------------------------------------------

  // a running tally of the deficit
  var deficit = null

  // days since planting, for help in determining the plant's current growth stage
  //var daysSincePlanting = null; ** removed for this implementation -kle
  // Total water available to plant
  var TAW = null
  // water stress coefficient
  var Ks = null
  // crop coefficient
  var Kc = null

  // values of model components for a single day
  var totalDailyDrainage = null
  var totalDailyRunoff = null
  var totalDailyPrecip = null
  var totalDailyPET = null
  var dailyPotentialDrainageRate = null

  // hourly rates of model components
  var hourlyPrecip = null
  var hourlyPET = null
  var hourlyDrainage = null
  var hourlyPotentialDrainage = null

  // OUTPUT VARS
  // arrays holding daily values of model components
  // deficitDaily is water deficit calculation we are looking for.
  // Other variables are just for potential water balance verification, etc, if the user chooses.
  var deficitDaily = []
  var deficitDailyChange = []
  var drainageDaily = []
  var runoffDaily = []
  var precipDaily = []
  var petDaily = []

  // Initialize deficit
  //   : to zero if saturated soil after irrigation)
  //   : to last observed deficit if running for forecasts
  deficit = initDeficit

  // the first elements in our output arrays. It include the water deficit initialization. Others will populate starting Day 2.
  deficitDaily.push(deficit)
  deficitDailyChange.push(null)
  drainageDaily.push(null)
  runoffDaily.push(null)
  petDaily.push(null)
  precipDaily.push(null)

  // Calculate daily drainage rate that occurs when soil water content is between saturation and field capacity
  dailyPotentialDrainageRate = getPotentialDailyDrainage(soilcap)

  // Need to know the number of days since planting for crop coefficient calculation
  // If the number is negative, assuming Kc = Kcini for bare soil and single crop coeff method (FAO-56)
  // daysSincePlanting =  Math.floor(( Date.parse(startDate) - Date.parse(plantingDate) ) / 86400000);    ** removed for this implementation -kle

  // Loop through all days, starting with the second day (we already have the deficit for the initial day from model initialization)
  for (var idx = 1; idx < pet.length; idx++) {
    // increment as we advance through the growth stages of the plant
    //daysSincePlanting += 1    ** removed for this implementation -kle

    // Calculate Ks, the water stress coefficient, using antecedent deficit
    TAW = getTawForPlant(soilcap)
    Ks = getWaterStressCoeff(deficitDaily[idx - 1], TAW)
    // Calculate Kc, the crop coefficient, using the days since planting
    //Kc = getSingleCropCoeff(daysSincePlanting,croptype);  ** removed for this implementation -kle
    Kc = 1 // ** added for this implementation -kle

    // Vars to hold the daily tally for components of the water balance model daily - mostly for calc verification
    // Initialize the daily totals here.
    totalDailyDrainage = 0
    totalDailyRunoff = 0
    // We already know what the daily total is for Precip and ET
    totalDailyPET = -1 * pet[idx] * Kc * Ks
    totalDailyPrecip = precip[idx]

    // Convert daily rates to hourly rates. For this simple model, rates are constant throughout the day.
    // For drainage : this assumption is okay
    // For precip   : this assumption is about all we can do without hourly observations
    // For PET      : this assumption isn't great. Something following diurnal cycle would be best.
    // For runoff   : not necessary. hourly runoff is determined without limits below.
    // ALL HOURLY RATES POSITIVE
    hourlyPrecip = totalDailyPrecip / 24
    hourlyPET = (-1 * totalDailyPET) / 24
    hourlyPotentialDrainage = dailyPotentialDrainageRate / 24

    for (var hr = 1; hr <= 24; hr++) {
      // Calculate hourly drainage estimate. It is bounded by the potential drainage rate and available
      // water in excess of the field capacity. We assume drainage does not occur below field capacity.
      if (deficit > 0) {
        hourlyDrainage = Math.min(deficit, hourlyPotentialDrainage)
      } else {
        hourlyDrainage = 0
      }
      totalDailyDrainage -= hourlyDrainage

      // calculate runoff for bookkeeping purposes
      // runoff is essentially calculated as the amount of water 'deficit' in excess of saturation
      // runoff is applied to the model by setting saturation bounds, below
      totalDailyRunoff -= Math.max(
        deficit +
          hourlyPrecip -
          hourlyPET -
          hourlyDrainage -
          (modeldata.soildata.soilmoistureoptions[soilcap].saturation -
            modeldata.soildata.soilmoistureoptions[soilcap].fieldcapacity),
        0,
      )

      // Adjust deficit based on hourly water budget.
      // deficit is bound by saturation (soil can't be super-saturated). This effectively reduces deficit by hourly runoff as well.
      deficit = Math.min(
        deficit + hourlyPrecip - hourlyPET - hourlyDrainage,
        modeldata.soildata.soilmoistureoptions[soilcap].saturation -
          modeldata.soildata.soilmoistureoptions[soilcap].fieldcapacity,
      )

      // deficit is bound by wilting point, but calculations should never reach wilting point based on this model. We bound it below for completeness.
      // In the real world, deficit is able to reach wilting point. The user should note that deficit values NEAR the wilting point
      // from this model should be interpreted as 'danger of wilting exists'.
      deficit = Math.max(
        deficit,
        -1 *
          (modeldata.soildata.soilmoistureoptions[soilcap].fieldcapacity -
            modeldata.soildata.soilmoistureoptions[soilcap].wiltingpoint),
      )
    }

    // user action: manually adding water deficiency
    let deficitAdjustmentSum = 0
    if (deficitAdjustment.length > 0) {
      deficitAdjustmentSum = deficitAdjustment.reduce((acc, curr) => acc + curr)
    }
    // console.log(
    //   `BEF: ${idx ===
    //     todayIdx}, ${idx}, ${todayIdx}, ${deficitAdjustment}, ${deficitAdjustmentSum}, ${deficit})}`
    // );

    deficit = idx === todayIdx ? deficit + deficitAdjustmentSum : deficit
    // console.log(
    //   `AFT: ${idx ===
    //     todayIdx}, ${idx}, ${todayIdx}, ${deficitAdjustment}, ${deficitAdjustmentSum},${deficit})}`
    // );

    deficitDailyChange.push(deficit - deficitDaily[deficitDaily.length - 1])
    deficitDaily.push(deficit)
    drainageDaily.push(totalDailyDrainage)
    runoffDaily.push(totalDailyRunoff)
    petDaily.push(totalDailyPET)
    precipDaily.push(totalDailyPrecip)
  }

  // console.log('INSIDE WATER DEFICIT MODEL');
  // console.log(deficitDaily);

  return {
    deficitDailyChange: deficitDailyChange,
    deficitDaily: deficitDaily,
    drainageDaily: drainageDaily,
    runoffDaily: runoffDaily,
    petDaily: petDaily,
    precipDaily: precipDaily,
  }
}
