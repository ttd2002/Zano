import { Text, TextInput, View } from "react-native";

const Diary=()=>{
    return(
        <View style={{width:'100%',padding:5}}>
            <TextInput
                multiline={true}
                style={{borderWidth:1,padding:10,fontSize:20, textAlignVertical: 'top'}}
                numberOfLines={10}
            >
            </TextInput>
        </View>
    )
}
export default Diary;