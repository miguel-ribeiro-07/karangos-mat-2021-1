import {useState, useEffect} from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
export default function KarangosForm(){

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

    const [karango, setKarango] = useState({
        id:null,
        marca: '',
        modelo: '',
        cor: '',
        ano_fabricacao:(new Date()).getFullYear(),
        importado:0,
        placa: '',
        preco: 0
    })
    function handleInputChange(event, property){
        if(event.target.id) property = event.target.id
        // Quando o nome de uma propriedade de objeto aparece entre [],
        // significa que o nome da propriedade será determinado pela
        // variável ou expressão contida dentro dos colchetes
        setKarango({...karango, [property]:event.target.value})
    }
    return(
        <>
        <h1>Cadastrar novo Karango</h1>
        <form>
        <TextField 
        id="marca" 
        label="Marca" 
        variant="filled"
        value={karango.marca}
        onChange={handleInputChange}
        required
        placeholder="Informe a marca do veículo"
        />
        <TextField 
        id="modelo" 
        label="Modelo" 
        variant="filled"
        value={karango.modelo}
        onChange={handleInputChange}
        required
        placeholder="Informe o modelo do veículo"
        />
        <TextField 
        id="cor" 
        label="Cor" 
        variant="filled"
        value={karango.modecorlo}
        onChange={event => handleInputChange(event, 'cor')}
        required
        placeholder="Informe a cor do veículo"
        select
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
        >
         {years.map(year => <MenuItem value={year}>{year}</MenuItem>)}    
        </TextField>
        <div>{JSON.stringify(karango)}</div>
        </form>
        </>
    )
}