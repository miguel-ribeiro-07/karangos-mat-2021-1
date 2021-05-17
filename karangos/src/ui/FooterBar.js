import {Typography, Toolbar} from '@material-ui/core'

export default function FooterBar(){
    return (
        <Toolbar>
            <Typography variant="caption" display="block">
            &copy; 2021 by <a href="mailto:miguel201060@hotmail.com"> Miguel Ribeiro</a>
            </Typography>
        </Toolbar>
    )
}