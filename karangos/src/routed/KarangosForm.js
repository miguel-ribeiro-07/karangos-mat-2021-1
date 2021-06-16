import { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import InputMask from 'react-input-mask'
import { makeStyles } from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import { useHistory, useParams } from 'react-router-dom'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import React from 'react'
import ConfirmDialog from '../ui/ConfirmDialog'

const useStyles = makeStyles(theme => ({
  form: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    maxWidth: '80%',
    margin: '0 auto',
    '& .MuiFormControl-root': {
      minWidth: '200px',
      maxWidth: '500px',
      margin: '0 24px 24px 0'
    }
  },
  toolbar: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: '36px'
  }
}))

export default function KarangosForm() {
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
  for(let i = (new Date()).getFullYear(); i >= 1900; i--) years.push(i)

  // Classes de caracters para a máscara da placa
  // 1) Três primeiras posições, somente letras (maiúsculas ou minúsculas) ~> [A-Za-z]
  // 2) Quinta, sétima e oitava posições, somente dígitos ~> [0-9]
  // 3) Sexta posição: dígitos ou letras (maiúsculas ou minúsculas) de A a J ~> [0-9A-Ja-j]
  const formatChars = {
    'A': '[A-Za-z]',
    '0': '[0-9]',
    '#': '[0-9A-Ja-j]'
  }

  // Máscara de entrada para a placa
  const placaMask = 'AAA-0#00'

  // Máscara para CPF: '000.000.000-00'
  // Máscara para CNPJ: '00.000.000/0000-00'

  const [karango, setKarango] = useState({
    id: null,
    marca: '',
    modelo: '',
    cor: '',
    ano_fabricacao: (new Date()).getFullYear(),    // Ano corrente
    importado: '0',
    placa: '',
    preco: 0
  })
  const [currentId, setCurrentId] = useState()

  const [importadoChecked, setImportadoChecked] = useState(false)

  const [sendBtnStatus, setSendBtnStatus] = useState({
    disabled: false,
    label: 'Enviar'
  })

  const [sbStatus, setSbStatus] = useState({
    open: false,
    severity: 'success',
    message: '' 
  })

  const [error, setError] = useState({
    marca: '',
    modelo: '',
    cor: '',
    placa: '',
    preco: ''
  })

  const [isModified, setIsModified] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false) // O diálogo de confirmação está aberto?

  const [title, setTitle] = useState('Cadastrar novo karango')

  const history = useHistory()
  const params = useParams()

  // useEffect() para quando o formulário for carregado (só na inicialização)
  useEffect(() => {
    // Verificamos se a rota atual contém o parâmetro id
    // Em caso positivo, buscamos os dados no back-end e carregamos o formulário para edição
    if(params.id) {
      setTitle('Editar karango')
      getData(params.id)
    }
  }, [])

  async function getData(id) {
    try {
      let response = await axios.get(`https://api.faustocintra.com.br/karangos/${id}`)
      setKarango(response.data)
    }
    catch(error) {
      setSbStatus({
        open: true,
        severity: 'error',
        message: 'Não foi possível carregar os dados para edição.'
      })
    }
  }

  function handleInputChange(event, property) {

    const karangoTemp = {...karango}

    setCurrentId(event.target.id)
    if(event.target.id) property = event.target.id

    if(property === 'importado') {
      const newState = ! importadoChecked // Inverte o valor
      if(newState) karangoTemp.importado = '1'
      else karangoTemp.importado = '0'
      setImportadoChecked(newState) 
    }
    else if(property === 'placa') {
      karangoTemp.placa = event.target.value.toUpperCase()
    }
    else {
      // Quando o nome de uma propriedade de objeto aparece entre [],
      // significa que o nome da propriedade será determinado pela
      // variável ou expressão contida dentro dos colchetes
      karangoTemp[property] = event.target.value
    }
    setKarango(karangoTemp)
    setIsModified(true)   // O formulário foi modificado
    validate(karangoTemp)  // Dispara a validação
  }

  function validate(data) {
    let isValid = true

    const errorTemp = {
      marca: '',
      modelo: '',
      cor: '',
      placa: '',
      preco: ''
    }

    // trim(): retira espaços em branco do início e do final de uma string
    if(data.marca.trim() === '') {
      errorTemp.marca = 'A marca deve ser preenchida'
      isValid = false
    }     

    if(data.modelo.trim() === '') {
      errorTemp.modelo = 'O modelo deve ser preenchido'
      isValid = false
    }

    if(data.cor.trim() === '') {
      errorTemp.cor = 'A cor deve ser informada'
      isValid = false
    }

    // A placa não pode ser string vazia nem conter sublinhado
    if(data.placa.trim() === '' || data.placa.includes('_')) {
      errorTemp.placa = 'A placa deve ser preenchida corretamente'
      isValid = false
    }

    // O preço deve ser numérico e maior que zero
    if(isNaN(data.preco) || Number(data.preco) <= 0) {
      errorTemp.preco = 'O preço deve ser informado e maior que zero'
      isValid = false
    }

    setError(errorTemp)
    return isValid
  }
  /**/

  async function saveData() {
    try {
      // Desabilita o botão de enviar para evitar envios duplicados
      setSendBtnStatus({disabled: true, label: 'Enviando...'})
      
      // Se estivermos editando, precisamos enviar os dados com o verbo HTTP PUT
      if(params.id) await axios.put(`https://api.faustocintra.com.br/karangos/${params.id}`, karango)
      // Senão, estaremos criando um novo registro, e o verbo HTTP a ser usado é o POST
      else await axios.post('https://api.faustocintra.com.br/karangos', karango)
      
      // Mostra a SnackBar
      setSbStatus({open: true, severity: 'success', message: 'Dados salvos com sucesso!'})
      
    }
    catch(error) {
      // Mostra a SnackBar
      setSbStatus({open: true, severity: 'error', message: 'ERRO: ' + error.message})
    }
    // Restaura o estado inicial do botão de envio
    setSendBtnStatus({disabled: false, label: 'Enviar'})
  }

  function handleSubmit(event) {

    event.preventDefault()    // Evita que a página seja recarregada

    // Só envia para o banco de dados se o formulário for válido
    if(validate(karango)) saveData()

  }

  function handleSbClose() {
    setSbStatus({...sbStatus, open: false})

    // Retorna para a página de listagem em caso de sucesso
    if(sbStatus.severity === 'success') history.push('/list')
  }

  function handleDialogClose(result) {
    setDialogOpen(false)

    // Se o usuário concordou em voltar 
    if(result) history.push('/list')
  }

  function handleGoBack() {
    // Se o formulário tiver sido modificado, exibimos o diálogo de confirmação
    if(isModified) setDialogOpen(true)
    // Senão, podemos voltar diretamente para a listagem
    else history.push('/list')
  }

  return (
    <>

      <ConfirmDialog isOpen={dialogOpen} onClose={handleDialogClose}>
        Há dados não salvos. Deseja realmente voltar?
      </ConfirmDialog>

      <Snackbar open={sbStatus.open} autoHideDuration={6000} onClose={handleSbClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleSbClose} severity={sbStatus.severity}>
          {sbStatus.message}
        </MuiAlert>
      </Snackbar>

      <h1>{title}</h1>
      <form className={classes.form} onSubmit={handleSubmit}>
        
        <TextField 
          id="marca" 
          label="Marca" 
          variant="filled"
          value={karango.marca}
          onChange={handleInputChange}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe a marca do veículo"
          fullWidth
          error={error.marca !== ''}
          helperText={error.marca}
        />

        <TextField 
          id="modelo" 
          label="Modelo" 
          variant="filled"
          value={karango.modelo}
          onChange={handleInputChange}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe o modelo do veículo"
          fullWidth
          error={error.modelo !== ''}
          helperText={error.modelo}
        />

        <TextField 
          id="cor" 
          label="Cor" 
          variant="filled"
          value={karango.cor}
          onChange={event => handleInputChange(event, 'cor')}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe a cor do veículo"
          select
          fullWidth
          error={error.cor !== ''}
          helperText={error.cor}
        >
          { colors.map(color => <MenuItem value={color} key={color}>{color}</MenuItem>)}
        </TextField>

        <TextField 
          id="ano_fabricacao" 
          label="Ano de fabricação" 
          variant="filled"
          value={karango.ano_fabricacao}
          onChange={event => handleInputChange(event, 'ano_fabricacao')}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe o ano de fabricação do veículo"
          select
          fullWidth
        >
          { years.map(year => <MenuItem value={year} key={year}>{year}</MenuItem>)}
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
            error={error.placa !== ''}
            helperText={error.placa}
          />}
        </InputMask>

        <TextField 
          id="preco" 
          label="Preço" 
          variant="filled"
          value={karango.preco}
          onChange={handleInputChange}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe o valor do veículo"
          fullWidth
          type="number"
          onFocus={event => event.target.select()}  // Seleciona o conteúdo ao focar
          InputProps={{
            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
          }}
          error={error.preco !== ''}
          helperText={error.preco}
        />

        <Toolbar className={classes.toolbar}>
          <Button type="submit" variant="contained" color="secondary" disabled={sendBtnStatus.disabled}>
            {sendBtnStatus.label}
          </Button>
          <Button variant="contained" onClick={handleGoBack}>Voltar</Button>
        </Toolbar>

        {/* <div>
          {JSON.stringify(karango)}
          <br />
          currentId: {JSON.stringify(currentId)}
          <br />
          isModified: {JSON.stringify(isModified)}
        </div> */}
      </form>
    </>
  )
}