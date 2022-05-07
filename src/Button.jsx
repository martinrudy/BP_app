import { View, Text } from "react-native"

const Button = (props) =>{
    return (
        <View style={{backgroundColor:"transparent"}}>
        <Text>{props.text}</Text>
        </View>
        )
}

export {Button}