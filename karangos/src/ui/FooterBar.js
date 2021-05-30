import {Typography, Toolbar} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import LocalCafeTwoToneIcon from '@material-ui/icons/LocalCafeTwoTone';
const useStyles = makeStyles((theme) => ({
    toolbar: {
      backgroundColor: theme.palette.background.paper,
      minHeight: '42px',
      width: '100%',
      position: 'fixed',
      bottom: 0
    },
    text: {
      width: '100%'
    },
    link: {
      color: theme.palette.secondary.light,
      textDecoration: 'none',  // tira o sublinhado do link
      '&:hover': {  // mouse sobre o link
        textDecoration: 'underline' // retorna o sublinhado
      }
    }
  }));

export default function FooterBar(){
    const classes = useStyles();
    return (
        <Toolbar className={classes.toolbar}>
            <Typography className={classes.text} variant="caption" display="block" align="center" color="textSecondary">
            Produced with <LocalCafeTwoToneIcon fontSize='small' /> by <a className={classes.link} href="mailto:miguel201060@hotmail.com"> Miguel Ribeiro</a>
            </Typography>
        </Toolbar>
    )
}