import React, {useContext, useState} from 'react'

import {withStyles, withTheme} from '@material-ui/core/styles'
import withRoot from '../withRoot'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import HomeIcon from '@material-ui/icons/HomeOutlined'
import List from '@material-ui/core/List'
import ListIcon from '@material-ui/icons/List'
import AddIcon from '@material-ui/icons/PlaylistAdd'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'

import format from 'date-fns/format'
import {determineColor} from '../utils/utils'

import Navigation from './Navigation'
import Loading from './Loading'
import {AppContext} from '../AppContext'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    height: window.innerHeight,
  },
  icon: {
    color: theme.palette.grey[500],
    fontSize: 32,
  },
  iconOnFocus: {
    color: theme.palette.primary.main,
    fontSize: 40,
  },
})

function FieldList(props) {
  // console.log("FieldList Component");
  const [isDialog, setIsDialog] = useState(false)
  const [fieldId, setFieldId] = useState(null)

  const {
    screenIdx,
    setScreenIdx,
    setSwipeble,
    fields,
    today,
    deleteField,
    selectField,
    isLoading,
  } = useContext(AppContext)
  const {classes, theme} = props

  return (
    <div className={classes.root}>
      <Navigation
        leftIcon={
          <HomeIcon
            className={classes.icon}
            onClick={() => setScreenIdx(screenIdx - 1)}
          />
        }
        centerIcon={
          <ListIcon
            className={screenIdx === 2 ? classes.iconOnFocus : classes.icon}
          />
        }
        rightIcon={
          <AddIcon
            className={classes.icon}
            onClick={() => setSwipeble('setupField')}
          />
        }
      />

      {isLoading ? (
        <Loading />
      ) : (
        <div
          style={{
            padding: theme.spacing.unit,
            overflowY: 'scroll',
          }}
        >
          <Grid container spacing={theme.spacing.unit * 2}>
            {fields.map(field => {
              const todayObj = field.data.find(
                obj => obj.date === format(today, 'MM/dd/yyyy'),
              )
              const color = determineColor(todayObj.deficit)

              return (
                <Grid item xs={12} key={field.id}>
                  <Paper
                    style={{
                      borderLeft: `16px solid ${color}`,
                    }}
                  >
                    <List component="nav">
                      <ListItem
                        button
                        onClick={() => {
                          setFieldId(field.id)
                          selectField(field.id)
                          setScreenIdx(screenIdx - 1)
                        }}
                      >
                        <div
                          style={{
                            marginLeft: -40,
                          }}
                        >
                          <Button
                            variant="fab"
                            style={{
                              background: color,
                              boxShadow: 'none',
                            }}
                            mini
                          >
                            <span style={{fontSize: 13}}>
                              {todayObj.deficit}
                            </span>
                          </Button>
                        </div>

                        <ListItemText
                          primary={field.address.split(',')[0]}
                          secondary={format(
                            new Date(field.irrigationDate),
                            'MMMM do, yyyy',
                          )}
                        />

                        <ListItemSecondaryAction>
                          <IconButton
                            aria-label="Delete"
                            onClick={() => {
                              setFieldId(field.id)
                              setIsDialog(true)
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              )
            })}
          </Grid>

          {/* DIALOG -----------------------------*/}
          <Dialog
            open={isDialog}
            onClose={() => setIsDialog(false)}
            aria-labelledby="alert-dialog-delete-field"
            aria-describedby="alert-dialog-delete-selected-field"
            hideBackdrop={true}
          >
            <DialogTitle id="alert-dialog-title">
              <Typography variant="body1">
                Are you sure you want to delete this field?
              </Typography>
            </DialogTitle>
            <DialogContent />
            <DialogActions>
              <Button onClick={() => setIsDialog(false)} color="primary">
                Undo
              </Button>
              <Button
                onClick={() => {
                  deleteField(fieldId)
                  setIsDialog(false)
                }}
                color="primary"
                autoFocus
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  )
}

export default React.memo(withRoot(withStyles(styles)(withTheme()(FieldList))))
