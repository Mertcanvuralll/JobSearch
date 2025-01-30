import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Chip,
  Box,
  Divider,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Tooltip,
} from '@material-ui/core';
import {
  BusinessCenter,
  LocationOn,
  Timer,
  Share,
  Bookmark,
  BookmarkBorder,
  Facebook,
  Twitter,
  LinkedIn,
  WhatsApp,
  FileCopy,
  MonetizationOn as MonetizationOnIcon,
  CheckCircle,
  Update as UpdateIcon,
  People as PeopleIcon,
} from '@material-ui/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import { getJobDetails, applyToJob } from '../services/jobService';
import { makeStyles } from '@material-ui/core/styles';
import { useResponsiveStyles } from '../styles/responsive';
import { useTheme, useMediaQuery } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(4),
    maxWidth: '1200px',
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(10),
    },
  },
  paper: {
    padding: theme.spacing(4),
    height: '100%',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  companyHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
  companyLogo: {
    width: 120,
    height: 120,
    objectFit: 'contain',
    marginRight: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontWeight: 600,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
  },
  companyName: {
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    padding: theme.spacing(2),
    borderRadius: 8,
    marginBottom: theme.spacing(3),
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing(3),
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.main,
    },
  },
  sectionTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    position: 'relative',
    paddingLeft: theme.spacing(2),
    '&:before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 4,
      height: '70%',
      backgroundColor: theme.palette.primary.main,
      borderRadius: 2,
    },
  },
  requirementsList: {
    listStyle: 'none',
    padding: 0,
    '& li': {
      position: 'relative',
      paddingLeft: theme.spacing(3),
      marginBottom: theme.spacing(1.5),
      '&:before': {
        content: '"•"',
        position: 'absolute',
        left: theme.spacing(1),
        color: theme.palette.primary.main,
        fontWeight: 'bold',
      },
    },
  },
  tag: {
    margin: theme.spacing(0.5),
    backgroundColor: 'rgba(126, 87, 194, 0.08)',
    color: theme.palette.primary.main,
    borderRadius: 16,
    '&:hover': {
      backgroundColor: 'rgba(126, 87, 194, 0.12)',
    },
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
    padding: theme.spacing(1.5),
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    '& .MuiSvgIcon-root': {
      color: theme.palette.success.main,
    },
  },
  applyButton: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(1.5),
    fontSize: '1.1rem',
    fontWeight: 500,
  },
  rightSidebar: {
    position: 'sticky',
    top: theme.spacing(16),
    [theme.breakpoints.down('sm')]: {
      position: 'static',
    },
  },
  similarJobCard: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
  },
  salary: {
    color: '#00796b',
    fontWeight: 500,
  },
  metaInfo: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(4),
    padding: theme.spacing(2, 0),
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    '& .MuiSvgIcon-root': {
      color: theme.palette.text.secondary,
    },
    '& .MuiTypography-root': {
      whiteSpace: 'nowrap',
    },
  },
  dividerSpacing: {
    margin: theme.spacing(3, 0),
  },
}));

const JobDetail = () => {
  const classes = useStyles();
  const responsiveClasses = useResponsiveStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);
  const [applying, setApplying] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await getJobDetails(id);
        setJob(data);
      } catch (error) {
        setError(error.message);
        enqueueSnackbar('İlan detayları yüklenemedi', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, enqueueSnackbar]);

  const handleApply = async () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    try {
      setApplying(true);
      await applyToJob(id);
      setShowSuccessAlert(true);
      const updatedJob = await getJobDetails(id);
      setJob(updatedJob);
    } catch (error) {
      console.error('Başvuru sırasında hata:', error);
      enqueueSnackbar(error.message || 'Başvuru yapılırken bir hata oluştu', { 
        variant: 'error',
        autoHideDuration: 4000
      });
    } finally {
      setApplying(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = job.title;
    let shareUrl;

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `whatsapp://send?text=${title} ${url}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setShowCopiedAlert(true);
        setShowShareDialog(false);
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setShowShareDialog(false);
  };

  const handleSave = () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }
    setIsSaved(!isSaved);
    // TODO: Backend'e kaydetme işlemi eklenecek
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper className={classes.paper}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  if (!job) {
    return (
      <Container className={classes.container}>
        <Typography variant="h5" align="center">
          İlan bulunamadı
        </Typography>
      </Container>
    );
  }

  return (
    <Container className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper className={classes.paper}>
            <div className={classes.companyHeader}>
              <img
                src={job.company.logo || '/default-company-logo.png'}
                alt={job.company.name}
                className={classes.companyLogo}
              />
              <div className={classes.titleSection}>
                <Typography variant="h5" className={classes.title}>
                  {job.title}
                </Typography>
                <Typography variant="h6" className={classes.companyName}>
                  {job.company.name}
                </Typography>
              </div>
            </div>

            <Box className={classes.metaInfo}>
              <Tooltip title={t('Son Güncelleme Tarihi')}>
                <Box className={classes.metaItem}>
                  <UpdateIcon fontSize="small" />
                  <Typography variant="body2" color="textSecondary">
                    {formatDistanceToNow(new Date(job.updatedAt), { 
                      addSuffix: true,
                      locale: tr 
                    })}
                  </Typography>
                </Box>
              </Tooltip>

              <Tooltip title={t('Toplam Başvuru')}>
                <Box className={classes.metaItem}>
                  <PeopleIcon fontSize="small" />
                  <Typography variant="body2" color="textSecondary">
                    {job.applicationCount || 0} {t('başvuru')}
                  </Typography>
                </Box>
              </Tooltip>

              <Tooltip title={t('İlan Süresi')}>
                <Box className={classes.metaItem}>
                  <Timer fontSize="small" />
                  <Typography variant="body2" color="textSecondary">
                    {formatDistanceToNow(new Date(job.createdAt), { 
                      addSuffix: true,
                      locale: tr 
                    })}
                  </Typography>
                </Box>
              </Tooltip>
            </Box>

            <Divider className={classes.dividerSpacing} />

            <Box className={classes.infoCard}>
              <div className={classes.infoGrid}>
                <div className={classes.infoItem}>
                  <LocationOn />
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Lokasyon
                    </Typography>
                    <Typography>
                      {job.location.city}
                      {job.location.district && `, ${job.location.district}`}
                    </Typography>
                  </div>
                </div>

                <div className={classes.infoItem}>
                  <BusinessCenter />
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Çalışma Şekli
                    </Typography>
                    <Typography>{job.type}</Typography>
                  </div>
                </div>

                <div className={classes.infoItem}>
                  <MonetizationOnIcon />
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Maaş Aralığı
                    </Typography>
                    <Typography className={classes.salary}>
                      {job.salary.min && `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ${job.salary.currency}`}
                    </Typography>
                  </div>
                </div>
              </div>
            </Box>

            <section className={classes.section}>
              <Typography variant="h6" className={classes.sectionTitle}>
                İş Tanımı
              </Typography>
              <Typography variant="body1" style={{ lineHeight: 1.7 }}>
                {job.description}
              </Typography>
            </section>

            <section className={classes.section}>
              <Typography variant="h6" className={classes.sectionTitle}>
                Aranan Nitelikler
              </Typography>
              <ul className={classes.requirementsList}>
                {job.requirements?.map((req, index) => (
                  <li key={index}>
                    <Typography>{req}</Typography>
                  </li>
                ))}
              </ul>
            </section>

            <section className={classes.section}>
              <Typography variant="h6" className={classes.sectionTitle}>
                Teknolojiler & Yetenekler
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {job.tags?.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    className={classes.tag}
                    size="medium"
                  />
                ))}
              </Box>
            </section>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              className={classes.applyButton}
              onClick={handleApply}
              disabled={applying}
              startIcon={applying ? <CircularProgress size={20} /> : null}
            >
              {applying ? 'Başvurunuz İletiliyor...' : 'Hemen Başvur'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <div className={classes.rightSidebar}>
            <Paper className={classes.paper}>
              <Typography variant="h6" className={classes.sectionTitle}>
                Yan Haklar
              </Typography>
              {job.benefits?.map((benefit, index) => (
                <div key={index} className={classes.benefitItem}>
                  <CheckCircle />
                  <Typography>{benefit}</Typography>
                </div>
              ))}
            </Paper>

            <Paper className={classes.paper} style={{ marginTop: 24 }}>
              <Typography variant="h6" className={classes.sectionTitle}>
                İşveren Hakkında
              </Typography>
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary">
                  {job.company.name} hakkında daha fazla bilgi...
                </Typography>
              </Box>
            </Paper>
          </div>
        </Grid>
      </Grid>

      {isMobile && (
        <div className={responsiveClasses.actionButtons}>
          <IconButton
            onClick={() => setShowShareDialog(true)}
          >
            <Share />
          </IconButton>
          <IconButton
            onClick={handleSave}
          >
            {isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />}
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApply}
            style={{ flex: 1, marginLeft: theme.spacing(2) }}
            disabled={applying}
          >
            {applying ? 'Başvuruluyor...' : 'Başvur'}
          </Button>
        </div>
      )}

      <Dialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        className={classes.shareDialog}
      >
        <DialogTitle>{t('Share Job')}</DialogTitle>
        <DialogContent>
          <List className={classes.shareList}>
            <ListItem onClick={() => handleShare('facebook')}>
              <ListItemIcon>
                <Facebook />
              </ListItemIcon>
              <ListItemText primary="Facebook" />
            </ListItem>
            <ListItem onClick={() => handleShare('twitter')}>
              <ListItemIcon>
                <Twitter />
              </ListItemIcon>
              <ListItemText primary="Twitter" />
            </ListItem>
            <ListItem onClick={() => handleShare('linkedin')}>
              <ListItemIcon>
                <LinkedIn />
              </ListItemIcon>
              <ListItemText primary="LinkedIn" />
            </ListItem>
            <ListItem onClick={() => handleShare('whatsapp')}>
              <ListItemIcon>
                <WhatsApp />
              </ListItemIcon>
              <ListItemText primary="WhatsApp" />
            </ListItem>
            <ListItem onClick={() => handleShare('copy')}>
              <ListItemIcon>
                <FileCopy />
              </ListItemIcon>
              <ListItemText primary={t('Copy Link')} />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      >
        <DialogTitle>{t('Login Required')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('You need to login to apply for this job')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLoginDialog(false)}>
            {t('Cancel')}
          </Button>
          <Button
            color="primary"
            onClick={() => navigate('/login')}
          >
            {t('Login')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={6000}
        onClose={() => setShowSuccessAlert(false)}
      >
        <Alert onClose={() => setShowSuccessAlert(false)} severity="success">
          {t('Your application has been received successfully')}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showCopiedAlert}
        autoHideDuration={2000}
        onClose={() => setShowCopiedAlert(false)}
      >
        <Alert onClose={() => setShowCopiedAlert(false)} severity="success">
          {t('Link copied to clipboard')}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default JobDetail; 