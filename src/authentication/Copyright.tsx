import Typography from '@material-ui/core/Typography';

export const Copyright = () => {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
          Ali Colver, Luke Ely & Simon Archer{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }