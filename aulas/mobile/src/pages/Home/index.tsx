import React ,{useState, useEffect} from 'react';
import {Feather as Icon} from '@expo/vector-icons'
import {View,ImageBackground, Text,Image, StyleSheet,TextInput,KeyboardAvoidingView,Platform, Picker} from 'react-native';
import {useNavigation} from '@react-navigation/native'; 
import axios from 'axios';
import  RNPickerSelect from 'react-native-picker-select';

import {RectButton} from 'react-native-gesture-handler';


interface IBGEResponse{
  sigla : string
}

interface IBGECityResponse {
  nome: string
}

interface Item {
  label: string,
  value: string
};
const ufPlaceholder = {
  label: 'Selecione um Estado',
  value: null
}

const cityPlaceholder = {
  label: 'Selecione uma Cidade',
  value: null
}


function createItem(s:string){
  const item:Item = {value:s,label:s};
  return  item;

}
const Home = () => {
    const navigation = useNavigation(); // objeto para navegar de uma tela para outra
      const [uf,setUf] = useState('0');
    const [city,setCity] = useState('0');
    const [ufs,setUfs]=useState<Item[]>([])
    const [cities, setCities] = useState<Item[]>([])
   
    //inicializa a lista de estados
    useEffect( ()=>{
      axios.get<IBGEResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then(response => {
        const itens:Item [] = [];
        response.data.map( (uf)=> {itens.push(createItem(uf.sigla))}
      )
      setUfs(itens);
    });
     
      //console.log(ufs);
    },[]);

    useEffect(() =>{
      if (uf === '0 '){
        console.log('uf é vazio');
        return ;
      }
      const city_url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`;
      axios.get<IBGECityResponse[]>(city_url)
      .then( response => {
        const itens:Item [] = [];
        response.data.map( (city) => { itens.push(createItem(city.nome))} )
        setCities(itens);
        //console.log(city_url)
       // console.log("intens=\n",itens)
      })
      
      //console.log(cities)
  },[uf])


    //função para carregar a tela points
    function handleNavigationPoints(){
        navigation.navigate('Points',{
          uf,city
        });
    }

    //função para modificar o valor do estado
    function handleChangeUf(value: string){
      console.log(value)
      setUf(value);
    }
    
    //função para modificar cidades
    function handleChangeSelectedCity(value: string){
      setCity(value);
    }
    

    
    
    
    return (
      <KeyboardAvoidingView 
      style={{flex:1 }}
        behavior={Platform.OS  === 'ios' ?  'padding'  : undefined }
      >
          <ImageBackground 
              source={require('../../assets/home-background.png')}
              style={styles.container}
              imageStyle={{width:274, height:368}}
          >
              <View style={styles.main}> 
                  <Image source={require('../../assets/logo.png')}/>
                  <View>
                    <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
                    <Text style={styles.description}>Ajudamos pessoas a encotrarem pontos de coleta de forma eficiente.</Text>
                  </View>
              </View>


              <View style={styles.footer}>
                <RNPickerSelect
                  onValueChange={(value) => handleChangeUf(value)}
                  items={ufs}
                  placeholder={ufPlaceholder}
              />
                <RNPickerSelect
                  onValueChange={(value) => handleChangeSelectedCity(value)}
                  items={cities}
                  placeholder={cityPlaceholder}
              />

                {/* <TextInput style={styles.input}
                  placeholder="Digite a UF"
                  value={uf}
                  onChangeText={setUf}
                  autoCapitalize="characters"
                  maxLength={2}
                  autoCorrect={false}
                /> */}
                {/* <TextInput style={styles.input} 
                  placeholder="Digite a cidade"
                  value={city}
                  onChangeText={setCity}
                  autoCorrect={false}
                /> */}
                  <RectButton style={styles.button} 
                      onPress={handleNavigationPoints}
                  >
                      <View style={styles.buttonIcon}>
                          <Text>
                              <Icon name="arrow-right" color="#FFF" size={24}/>
                          </Text>
                      </View>
                    
                      <Text style={styles.buttonText}>
                          Entrar
                      </Text>
                  </RectButton>
              </View>
          </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32 
    },
  
    main: {
      flex: 1,
      justifyContent: 'center', 
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
     
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });
export default Home;
