import {useState, useEffect} from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import {makeStyles} from '@material-ui/core/styles'
import { Button, FormControl, Toolbar } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputMask from 'react-input-mask'
import InputAdornment from '@material-ui/core/InputAdornment'
import axios from 'axios'


const useStyles = makeStyles(theme => ({
    form:{
        display:'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        maxWidth:'80%',
        margin:'0 auto',
        '& .MuiFormControl-root':{
            minWidth: '200px',
            maxWidth: '500px',
            margin: '0 24px 24px 0'
        }
    },
    toolbar:{
      display:'flex',
      width:'100%',
      justifyContent: 'space-around',
      marginTop: '36px'
    }
})

)


export default function KarangosForm(){
    const classes = useStyles()
    const colors = [
        'Amarelo',
        'Azul',
        'Bege',
        'Branco',
        'Cinza',
        'Dourado',
        'Laranja',
        'Marrom',
        'Prata',
        'Preto',
        'Rosa',
        'Roxo',
        'Verde',
        'Vermelho',
        'Vinho'
      ]
    const years = []
    for(let i = (new Date()).getFullYear(); i>= 1900; i--) years.push(i)

    // Classes de caracters para a máscara da placa
    // 1) Três primeiras posições, somente letras (maiúsculas ou minúsculas) ~> [A-Za-z]
    // 2) Quinta, sétima e oitava posições, somente dígitos ~> [0-9]
    // 3) Sexta posição: dígitos ou letras (maiúsculas ou minúsculas) de A a J ~> [0-9A-Ja-j]

    const formatChars = {
      'A': '[A-Za-z]',
      '0': '[0-9]',
      '#': '[0-9A-Ja-j]'
    }
    const placaMask = 'AAA-0#00'
    const [karango, setKarango] = useState({
        id:null,
        marca: '',
        modelo: '',
        cor: '',
        ano_fabricacao:(new Date()).getFullYear(),
        importado: '0',
        placa: '',
        preco: 0
    })
    const [importadoChecked, setImportadoChecked] = useState(false)
    const [sendBtnStatus, setSendBtnStatus] = useState({
      disabled:false,
      label: 'Enviar'
    })

    function handleInputChange(event, property){
        if(event.target.id) property = event.target.id
        if(property === 'importado') {
            const newState = !importadoChecked // Inverte o valor
            if(newState) setKarango({...karango, importado: '1'})
            else setKarango({...karango, importado: '0'})
            setImportadoChecked(newState) 
          }
          else if(property === 'placa') {
            setKarango({...karango, placa: event.target.value.toUpperCase()})
          }
        // Quando o nome de uma propriedade de objeto aparece entre [],
        // significa que o nome da propriedade será determinado pela
        // variável ou expressão contida dentro dos colchetes
        setKarango({...karango, [property]:event.target.value})
    }
    async function saveData(){
      try{
        setSendBtnStatus({disabled:true, label:'Enviando...'})
        await axios.post('https://api.faustocintra.com.br/karangos', karango)
        alert('Dados salvos com sucesso!')
      }
      catch(error){
        alert('ERROR: ' + error.message)
      }
      setSendBtnStatus({disabled:false, label:'Enviar'})
    }
    function handleSubmit(event){
      event.preventDefault() //Evita recarregamento
      
      saveData()
    }
    return(
        <>
        <h1>Cadastrar novo Karango</h1>
        <form className={classes.form}>
        <TextField 
        id="marca" 
        label="Marca" 
        variant="filled"
        value={karango.marca}
        onChange={handleInputChange}
        required
        placeholder="Informe a marca do veículo"
        fullWidth
        />
        <TextField 
        id="modelo" 
        label="Modelo" 
        variant="filled"
        value={karango.modelo}
        onChange={handleInputChange}
        required
        placeholder="Informe o modelo do veículo"
        fullWidth
        />
        <TextField 
        id="cor" 
        label="Cor" 
        variant="filled"
        value={karango.modelo}
        onChange={event => handleInputChange(event, 'cor')}
        required
        placeholder="Informe a cor do veículo"
        select
        fullWidth
        >
         {colors.map(color => <MenuItem value={color}>{color}</MenuItem>)}    
        </TextField>
        <TextField 
        id="ano_fabricacao" 
        label="Ano Fabricação" 
        variant="filled"
        value={karango.ano_fabricacao}
        onChange={event => handleInputChange(event, 'ano_fabricacao')}
        required
        placeholder="Informe o ano de fabricação do veículo"
        select
        fullWidth
        >
         {years.map(year => <MenuItem value={year}>{year}</MenuItem>)}    
        </TextField>

        <FormControl fullWidth>
          <FormControlLabel control={
            <Checkbox
              id="importado"
              checked={importadoChecked}
              onChange={handleInputChange}
            />
          }
          label="Importado?"
        />
        </FormControl>
        <InputMask
          id="placa" 
          mask={placaMask}
          formatChars={formatChars}
          value={karango.placa}
          onChange={(event) => handleInputChange(event, 'placa')}
        >
          {() => <TextField 
            label="Placa" 
            variant="filled"
            required  /* not null, precisa ser preenchido */
            placeholder="Informe a placa do veículo"
            fullWidth
          />}
        </InputMask>
        <TextField 
        id="preco" 
        label="Preço" 
        variant="filled"
        value={karango.preco}
        onChange={handleInputChange}
        required
        placeholder="Informe o valor do veículo"
        fullWidth
        type="number"
        onFocus={event => event.target.select()}
        InputProps={{
          startAdornment: <InputAdornment position="start">R$</InputAdornment>,
          }}
        />
        <Toolbar>
          <Button className={classes.toolbar} type="submit" variant="contained" color="secondary" disable={sendBtnStatus.disabled}>
            {sendBtnStatus.label}
            </Button>
          <Button variant="contained">Voltar</Button>
        </Toolbar>
        <div>{JSON.stringify(karango)}</div>
        </form>
        </>
    )
}