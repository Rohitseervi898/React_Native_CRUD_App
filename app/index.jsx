import { Text, View, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import {data} from '../data/todo.js';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import {Colors} from "../constants/Colors"
import { Octicons } from "@expo/vector-icons";
import Animated, {LinearTransition} from 'react-native-reanimated'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";


export default function Index() {
  const [todos,setTodos]=useState([]);
  const [text,setText]=useState('');

  const {colorScheme, setColorScheme, theme}= useContext(ThemeContext)
  const [loaded, error] = useFonts({
    Inter_500Medium,
  })

  useEffect(()=>{
    const fetchData=async() => {
      try{
        const jsonValue= await AsyncStorage.getItem('TodoApp')
        const storagetodos=jsonValue!=null?JSON.parse(jsonValue):null
        if(storagetodos && storagetodos.length){
          setTodos(storagetodos.sort((a,b)=>b.id-a.id))
        }else{
          setTodos(data.sort((a,b)=>b.id-a.id))
        }
      }catch(e){
        console.error(e);
      }
    }
    fetchData()
  },[data])

  useEffect(()=>{
    const storeData=async()=>{
      try{
        const jsonValue=JSON.stringify(todos)
        await AsyncStorage.setItem("TodoApp",jsonValue)
      }catch(e){
        console.error(e)
      }
    }
    storeData()
  },[todos])
  if(!loaded && !error){
    return null;
  }

  const styles=createStyle(theme, colorScheme)
  const addTodo=()=>{
    if(text.trim()){
      const newId=todos.length>0?todos[0].id+1:1;
      setTodos([{id:newId,title:text,completed:false},...todos])
      setText('');
    }
  }

  const toggleTodo=(id)=>{
    setTodos(todos.map(todo=>todo.id===id?{...todo,completed:!todo.completed}:todo))
  }

  const removeTodo=(id)=>{
    setTodos(todos.filter(todo=>todo.id!==id))
  }

  const renderItem=({item})=>{
    return(
    <View style={styles.todoItem}>
      <Text style={[styles.todoText, item.completed && styles.completedText]}
      onPress={()=>toggleTodo(item.id)}
      >{item.title}</Text>
      <Pressable onPress={()=>removeTodo(item.id)}>
      <AntDesign name="delete" size={24} color={theme.icon}  />
      </Pressable>
    </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo"
          placeholderTextColor='gray'
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
        <Pressable onPress={()=>setColorScheme(colorScheme==='light'?'dark':'light')} style={{marginLeft:10}}>
          {colorScheme ==='dark' ? <Octicons name='moon' size={36} color={theme.text} selectable={undefined} style={{width:36}}/>
          :<Octicons name='sun' size={36} color={theme.text} selectable={undefined} style={{width:36}}/>
          }
        </Pressable>
      </View>
      <Animated.FlatList 
      data={todos}
      renderItem={renderItem }
      keyExtractor={todo=>todo.id}
      contentContainerStyle={{flexGrow:1}}
      itemLayoutAnimation={LinearTransition}
      keyboardDismissMode='on-drag'
      />
      <StatusBar style={colorScheme==='dark'?'light':'dark'} />
    </SafeAreaView>
  );
}

function createStyle(theme, colorScheme){
  return StyleSheet.create({
    container:{
      flex:1,
      width:'100%',
      backgroundColor:theme.background,
    },
    inputContainer:{
      flexDirection:'row',
      alignItems:'center',
      marginBottom:10,
      padding:10,
      width:'100%',
      maxWidth:1024,
      marginHorizontal:'auto',
      pointerEvents:'auto'
    },
    input:{
      flex:1,
      borderColor:'gray',
      borderWidth:1,
      borderRadius:5,
      padding:10,
      marginRight:10,
      fontSize:18,
      fontFamily:'Inter_500Medium',
      minWidth:0,
      color:theme.text,
    },
    addButton:{
      backgroundColor:theme.button,
      borderRadius:5,
      padding:10,
    },
    addButtonText:{
      fontSize:18,
      color:colorScheme==='dark'?'black': 'white',
    },
    todoItem:{
      flexDirection:'row',
      alignItems:'center',
      justyfyContent:'space-between',
      gap:4,
      padding:10,
      borderBottomColor:'gray',
      borderBottomWidth:1,
      width:'100%',
      maxWidth:1024,
      marginHorizontal:'auto',
      pointerEvents:'auto',
    },
    todoText:{
      flex:1,
      fontSize:18,
      color:theme.text,
      fontFamily:'Inter_500Medium',
    },
    completedText:{
      textDecorationLine:'line-through',
      color:'gray'
    }

  })
}
