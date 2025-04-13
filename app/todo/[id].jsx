import {useLocalSearchParams} from "expo-router";
import {Text, View, StyleSheet, Pressable, TextInput} from 'react-native';
import { useState, useEffect, useContext } from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import { ThemeContext } from "../../context/ThemeContext";
import {StatusBar} from 'expo-status-bar';
import {Inter_500Medium, useFonts} from '@expo-google-fonts/inter'
import {Octicons} from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from "expo-router";


export default function EditScreeen(){
    const {id} =useLocalSearchParams();
    const [todo, setTodo] =useState({});
    const {colorScheme, setColorScheme, theme} =useContext(ThemeContext)
    const router=useRouter();
    const styles=createStyles(theme, colorScheme)

    const [loaded, error] =useFonts({
        Inter_500Medium,
    })

    useEffect(()=>{
        const fetchData = async(id)=>{
            try{
                const jsonValue=await AsyncStorage.getItem("TodoApp")
                const storageTodos=jsonValue!=null ? JSON.parse(jsonValue):null;

                if(storageTodos && storageTodos.length){
                    const mytodo =storageTodos.find(todo=>todo.id.toString()===id)
                    setTodo(mytodo)
                }
            }
            catch(e){
                console.error(e)
            }
        }   
        fetchData(id);
    },[id])

    if(!loaded && !error){
        return null
    }
    const handleSave=async()=>{
        try{
            const savedtodo={...todo,title:todo.title}
            const jsonValue=await AsyncStorage.getItem("TodoApp")
            const storageTodos=jsonValue !=null? JSON.parse(jsonValue):null
            if (storageTodos && storageTodos.length){
                const otherTodos= storageTodos.filter(todo=>todo.id!==savedtodo.id)
                const alltodos=[...otherTodos,savedtodo]
                await AsyncStorage.setItem ('TodoApp', JSON.stringify(alltodos))
            }else{
                await AsyncStorage.setItem("TodoApp",JSON.stringify([savedtodo]))
            }
            router.push('/')
        }
        catch(e){
            console.error(e)
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    maxLength={30}
                    placeholder="Edit todo"
                    placeholderTextColor='gray'
                    value={todo?.title || ''}
                    onChangeText={(text)=>setTodo((prev)=>({...todo,title:text}))}
                />
                <Pressable onPress={()=>setColorScheme(colorScheme==='light'?'dark':'light')} style={{marginLeft:10}}>
                    {colorScheme ==='dark' ? <Octicons name='moon' size={36} color={theme.text} selectable={undefined} style={{width:36}}/>
                    :<Octicons name='sun' size={36} color={theme.text} selectable={undefined} style={{width:36}}/>
                    }
                </Pressable>
            </View>
            <View style={styles.inputContainer}>
                <Pressable
                    onPress={handleSave}
                    style={styles.saveButton}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
                <Pressable
                    onPress={()=>router.push('/')}
                    style={[styles.saveButton ,{backgroundColor:'red'}]}
                >
                    <Text style={[styles.saveButtonText, {color:'white'}]}>cancel</Text>
                </Pressable>
            </View>
            <StatusBar style={colorScheme==='dark'? 'light' : 'dark'}/>
        </SafeAreaView>
    )
}

function createStyles(theme, colorScheme){
    return StyleSheet.create({
        container:{
            flex:1,
            width:'100%',
            backgroundColor:theme.background,
        },
        inputContainer:{
            flexDirection:'row',
            alignItems:'center',
            padding:10,
            gap:6,
            width:'100%',
            maxWidth:1024,
            marginHorizontal:'auto'
        },
        input:{
            flex:1,
            borderWidth:1,
            borderColor:'gray',
            borderRadius:10,
            marginRight:10,
            fontSize:20,
            padding:'10px',
            fontFamily:'Inter_500Medium',
            minWidth:0,
            color:theme.text,
        },
        saveButton:{
            backgroundColor:theme.button,
            borderRadius:5,
            padding:10,
        },
        saveButtonText:{
            fontSize:18,
            color:colorScheme==='dark'?'black':'white',
        }
    })
}