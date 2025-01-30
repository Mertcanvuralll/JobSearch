import { makeStyles } from '@material-ui/core/styles';

export const useResponsiveStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(4),
    },
  },
  searchBar: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      '& > *': {
        marginBottom: theme.spacing(2),
      },
    },
  },
  filterDrawer: {
    width: 280,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  desktopFilters: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  mobileFilterButton: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  jobCard: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      '& .MuiTypography-h6': {
        fontSize: '1.1rem',
      },
    },
  },
  jobDetailContainer: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      '& > *': {
        marginBottom: theme.spacing(2),
      },
    },
  },
  infoSection: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: theme.spacing(2),
    },
  },
  chipContainer: {
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(1),
    },
  },
  actionButtons: {
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      padding: theme.spacing(2),
      backgroundColor: '#fff',
      boxShadow: theme.shadows[3],
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-around',
    },
  },
  mobileMenuButton: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  desktopMenu: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  filterPaper: {
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(2),
    },
  },
  noResults: {
    padding: theme.spacing(4),
    textAlign: 'center',
  },
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  detailPaper: {
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(4),
    },
  },
  errorPaper: {
    padding: theme.spacing(4),
    textAlign: 'center',
    marginTop: theme.spacing(4),
  },
})); 