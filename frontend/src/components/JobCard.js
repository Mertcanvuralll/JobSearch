import React from 'react';
import {
  Typography,
  Box,
  Chip,
  Grid,
  Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import WorkIcon from '@material-ui/icons/Work';
import TimerIcon from '@material-ui/icons/Timer';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

const useStyles = makeStyles((theme) => ({
  jobCard: {
    display: 'flex',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1.5),
    borderRadius: 8,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: '1px solid rgba(0,0,0,0.08)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      borderColor: theme.palette.primary.main,
    },
  },
  companyLogo: {
    width: 64,
    height: 64,
    objectFit: 'contain',
    padding: theme.spacing(1),
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginRight: theme.spacing(2),
    transition: 'transform 0.2s ease',
    [theme.breakpoints.down('sm')]: {
      width: 56,
      height: 56,
    },
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  headerSection: {
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(0.5),
  },
  companyName: {
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
  infoContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(1.5),
    '& .MuiSvgIcon-root': {
      fontSize: 18,
      color: theme.palette.primary.main,
    },
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    color: theme.palette.text.secondary,
    '& .MuiTypography-root': {
      fontSize: '0.85rem',
    },
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
  },
  tag: {
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(126, 87, 194, 0.08)',
    color: theme.palette.primary.main,
    '& .MuiChip-label': {
      fontSize: '0.75rem',
      padding: '0 8px',
    },
  },
  salary: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    color: '#00796b',
    fontWeight: 600,
    fontSize: '0.95rem',
    padding: theme.spacing(0.5, 1.5),
    borderRadius: 16,
    backgroundColor: 'rgba(0, 121, 107, 0.08)',
    marginTop: theme.spacing(1),
  },
}));

const JobCard = ({ job }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/jobs/${job._id}`);
  };

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Belirtilmedi';
    if (!max) return `${min.toLocaleString()}+ ${currency}`;
    return `${min.toLocaleString()} - ${max.toLocaleString()} ${currency}`;
  };

  return (
    <Paper className={classes.jobCard} onClick={handleCardClick}>
      <img
        src={job.company.logo || '/images/companies/default-company.png'}
        alt={job.company.name}
        className={classes.companyLogo}
        onError={(e) => {
          e.target.src = '/images/companies/default-company.png';
        }}
      />
      <Box className={classes.contentContainer}>
        <Box className={classes.headerSection}>
          <Typography variant="h6" className={classes.title}>
            {job.title}
          </Typography>
          <Typography variant="subtitle1" className={classes.companyName}>
            {job.company.name}
          </Typography>
        </Box>

        <Box className={classes.infoContainer}>
          <Box className={classes.infoItem}>
            <LocationOnIcon />
            <Typography>
              {job.location.city}
              {job.location.district && `, ${job.location.district}`}
            </Typography>
          </Box>
          <Box className={classes.infoItem}>
            <WorkIcon />
            <Typography>{job.type}</Typography>
          </Box>
          <Box className={classes.infoItem}>
            <TimerIcon />
            <Typography>
              {formatDistanceToNow(new Date(job.createdAt), {
                addSuffix: true,
                locale: tr,
              })}
            </Typography>
          </Box>
        </Box>

        <Box className={classes.tagsContainer}>
          {job.tags.slice(0, 4).map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              className={classes.tag}
            />
          ))}
        </Box>

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Box className={classes.salary}>
            <MonetizationOnIcon />
            <Typography>
              {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default JobCard; 