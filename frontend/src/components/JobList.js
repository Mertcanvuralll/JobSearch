import React from 'react';
import { Box, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import JobCard from './JobCard';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
  },
  noJobs: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(4),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
}));

const JobList = ({ jobs, loading, error }) => {
  const classes = useStyles();

  if (loading) {
    return (
      <Box className={classes.loading}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center">
        {error}
      </Typography>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <Typography variant="body1" className={classes.noJobs}>
        Henüz hiç iş ilanı bulunmuyor.
      </Typography>
    );
  }

  return (
    <Box className={classes.root}>
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </Box>
  );
};

export default JobList; 