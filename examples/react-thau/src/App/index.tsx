import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { AuthProvider } from '../react-thau'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default () => {
  const classes = useStyles();
  return (
    <AuthProvider authUrl="https://thau.quester-app.dev">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            React Thay
          </Typography>
          <Button color="inherit">useLogin</Button>
        </Toolbar>
      </AppBar>
    </AuthProvider>
  )
}