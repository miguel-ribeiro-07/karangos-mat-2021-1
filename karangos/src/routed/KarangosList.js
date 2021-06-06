import {useState, useEffect} from 'react'
import axios from 'axios'
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import AddBoxIcon from '@material-ui/icons/AddBox';
import {useHistory} from 'react-router-dom'
import ConfirmDialog from '../ui/ConfirmDialog'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  tableRow: {
    '& button': {       // Esconde os botões na linha de tabela "normal"
      visibility: 'hidden'
    },
    '&:hover button': { // Exibe os botões de volta quando o mouse passar por cima
      visibility: 'visible'
    },
    '&:hover': {        // Cor de fundo diferente quando o mouse passar sobre a linha
      backgroundColor: theme.palette.action.hover
    }
  },
  toolbar:{
    justifyContent:'flex-end',
    paddingRight:0,
    marginTop: theme.spacing(2,0),
  }
}));

export default function KarangosForm(){
    const classes = useStyles();
    const [karangos, setKarangos] = useState([])
    const [deletable, setDeletable] = useState()
    const [dialogOpen, setDialogOpen] =  useState(false)
    const history = useHistory()
    const[sbOpen, setSbOpen] = useState(false)
    const[sbSeverity, setSbSeverity] = useState('sucess')
    const[sbMessage, setSbMessage] = useState('Exclusão com sucesso!')


    useEffect(()=>{
        async function getData(){
            try{
                let response = await axios.get('https://api.faustocintra.com.br/karangos?by=marca,modelo')
            setKarangos(response.data)
            }
            catch(error){
                console.log(error)
            }
        }     
        getData()
    }, [])// Executado apenas uma vez no carregamento
        //inicial quando está vazio
        async function deleteItem() {
          try {
            await axios.delete(`https://api.faustocintra.com.br/karangos/${deletable}`)
            setSbSeverity('success')
            setSbMessage('Exclusão efetuada com sucesso.')
          }
          catch(error) {
            setSbSeverity('error')
            setSbMessage('ERRO: ' + error.message)
          }
          setSbOpen(true)   // Exibe a snackbar
        }
        function handleDialogClose(result){
          setDialogOpen(false)
              if(result) deleteItem()
        }
        function handleDelete(id){
          setDeletable(id)
          setDialogOpen(true)
        }
        function handleSbClose(){
          setSbOpen(false)
        }
    return(
        <>
        <ConfirmDialog isOpen={dialogOpen} onClose={handleDialogClose}>
          Deseja Realmente excluir este Karango?
        </ConfirmDialog>
        <Snackbar open={sbOpen} autoHideDuration={6000} onClose={handleSbClose}>
          <MuiAlert elevation={6} variant="filled" onClose={handleSbClose} severity={sbSeverity}>
            {sbMessage}
          </MuiAlert>
        </Snackbar>
        <h1>Listar Karangos</h1>
        <Toolbar className={classes.toolbar}>
          <Button color='secondary' variant='contained' size='large'
           startIcon={<AddBoxIcon/>} onClick={() => history.push('/new')}>
             Novo Karango
          </Button>
        </Toolbar>
        <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Cód.</TableCell>
            <TableCell>Marca</TableCell>
            <TableCell>Modelo</TableCell>
            <TableCell>Cor</TableCell>
            <TableCell align='center'>Ano</TableCell>
            <TableCell align='center'>Importado?</TableCell>
            <TableCell align='center'>Placa</TableCell>
            <TableCell align='right'>Preço</TableCell>
            <TableCell align='right'>Editar</TableCell>
            <TableCell align='right'>Excluir</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {karangos.map((karango) => (
            <TableRow key={karango.name} className={classes.tableRow}>
              <TableCell >{karango.id}</TableCell>
              <TableCell >{karango.marca}</TableCell>
              <TableCell >{karango.modelo}</TableCell>
              <TableCell >{karango.cor}</TableCell>
              <TableCell align='center' >{karango.ano_fabricacao}</TableCell>
              <TableCell align='center'>
                <Checkbox  checked={karango.importado === '1' ? true: false} readonly='readonly'/>
              </TableCell>
              <TableCell align='center'>{karango.placa}</TableCell>
              <TableCell align='right'>{Number(karango.preco).toLocaleString('pt-br', {style:'currency', currency: 'BRL'})}
              </TableCell>
              <TableCell align='right'>
              <IconButton aria-label="editar">
                <EditIcon/>
              </IconButton>
              </TableCell>
              <TableCell align='right'>
              <IconButton aria-label="delete" onClick={() => handleDelete(karango.id)}>
                <DeleteIcon color="error"/>
              </IconButton>
              </TableCell>            
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </>
    )
}