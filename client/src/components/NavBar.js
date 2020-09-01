import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuthContext } from '../context/auth/authState';
import { logoutUser } from '../context/auth/authReducer';
import { useEntryContext } from '../context/entry/entryState';
import { toggleDarkMode } from '../context/entry/entryReducer';
import storageService from '../utils/localStorageHelpers';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  Switch,
} from '@material-ui/core';

import { useNavStyles } from '../styles/muiStyles';
import { useTheme } from '@material-ui/core/styles';
import ListAltRoundedIcon from '@material-ui/icons/ListAltRounded';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [{ user }, authDispatch] = useAuthContext();
  const [{ darkMode }, entryDispatch] = useEntryContext();

  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useNavStyles();

  const handleLogout = () => {
    authDispatch(logoutUser());
    storageService.logoutUser();
    if (isMobile) {
      handleClose();
    }
  };

  const mobileMenu = () => {
    return user ? (
      <div>
        <MenuItem onClick={() => handleClose()}>
          Hi, {user && user.displayName}
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>{' '}
      </div>
    ) : (
      <div>
        <MenuItem
          component={RouterLink}
          to="/register"
          onClick={() => handleClose()}
        >
          Register
        </MenuItem>
        <MenuItem
          component={RouterLink}
          to="/login"
          onClick={() => handleClose()}
        >
          Login
        </MenuItem>{' '}
      </div>
    );
  };

  const desktopMenu = () => {
    return user ? (
      <>
        <Typography variant="body1" className={classes.user}>
          Hi, {user && user.displayName}
        </Typography>
        <Button
          color="inherit"
          startIcon={<PowerSettingsNewIcon />}
          onClick={handleLogout}
          className={classes.navButtons}
        >
          Logout
        </Button>{' '}
      </>
    ) : (
      <>
        <Button
          component={RouterLink}
          to="/register"
          color="inherit"
          className={classes.navButtons}
        >
          Register
        </Button>
        <Button
          component={RouterLink}
          to="/login"
          color="inherit"
          className={classes.navButtons}
        >
          Login
        </Button>
      </>
    );
  };

  const handleDarkMode = () => {
    entryDispatch(toggleDarkMode());
    storageService.saveDarkMode(!darkMode);
  };

  return (
    <div className={classes.main}>
      <AppBar position="static">
        <Toolbar>
          <div className={classes.title}>
            <Button
              component={RouterLink}
              to="/"
              startIcon={<ListAltRoundedIcon />}
              color="inherit"
              className={classes.titleButton}
              size="large"
            >
              ToViewList
            </Button>
          </div>

          {isMobile ? (
            <>
              <IconButton onClick={handleMenu} color="inherit">
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                {mobileMenu()}
              </Menu>
            </>
          ) : (
            <>
              {desktopMenu()}
              <Switch
                checked={darkMode}
                onChange={handleDarkMode}
                icon={<Brightness7Icon style={{ color: '#fbec5d' }} />}
                checkedIcon={<Brightness4Icon style={{ color: '#605b79' }} />}
              />
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
