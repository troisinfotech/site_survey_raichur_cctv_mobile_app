import React from "react";
import { View, Text, TextInput, StyleSheet, useColorScheme } from "react-native";
import RadioButtonGroup from './RadioButtonGroup';
import { COLOR } from "../common/typography";


const QuestionnaireItem = ({ question, value, onChange, remark, setRemark }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const labelStyle = {
        color: isDarkMode ? 'white' : 'black', marginVertical: 10, fontWeight: '600'
      };

    return (
      <View style={styles.container}>
        <Text style={labelStyle}>{question}</Text>
        
        {/* Yes / No Radio Button */}
        <RadioButtonGroup
          options={[
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ]}
          defaultValue={value}
          onValueChange={onChange}
        />
  
        {/* Remark Input Field */}
        <Text style={labelStyle}>Remark</Text>
        <TextInput
          style={[styles.input, { textAlignVertical: 'top' }]}
          placeholder="Enter remark"
          value={remark}
          onChangeText={setRemark}
          multiline
          numberOfLines={3}
        />

      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      marginBottom: 15,
      backgroundColor:COLOR.TRANSPARENT_PRIMARY,
      padding:10,
      borderRadius:10
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      color:COLOR.WHITE
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 8,
      marginTop: 5,

    borderColor: 'black',
    borderRadius: 7,
    backgroundColor: 'white',
    padding: 10,
    color: 'black'
    },
  });
  
  export default QuestionnaireItem;