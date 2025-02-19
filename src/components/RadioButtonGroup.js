import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { COLOR } from '../common/typography';

const RadioButtonGroup = ({ options, defaultValue, onValueChange }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Set default state from API (handle false correctly)
    const [checked, setChecked] = useState(defaultValue === true ? "true" : "false");

    // Ensure the state updates when API changes
    useEffect(() => {
        console.log("🔄 API Default Value Updated:", defaultValue);
        setChecked(defaultValue === true ? "true" : "false");
    }, [defaultValue]);

    // const handlePress = (value) => {
    //     console.log("🛠️ Clicked Value:", value);

    //     // Use a callback to ensure state updates correctly
    //     setChecked(() => {
    //         onValueChange(value === "true"); // Ensure latest value is sent
    //         return value;
    //     });
    // };
    const handlePress = (value) => {
        console.log("🛠️ Clicked Value:", value);
        setChecked(value);
        
        setTimeout(() => {
            console.log("✅ Sent to Parent:", value === "true");
            onValueChange(value === "true"); // Ensure parent receives the correct boolean
        }, 100);
    };

    return (
        <View style={styles.radioContainer}>
            {options.map((option) => {
                const isSelected = checked === option.value;

                return (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => handlePress(option.value)}
                        style={styles.radioButton}
                    >
                        <View style={isSelected ? styles.radioChecked : styles.radioUnchecked} />
                        <Text style={[styles.radioLabel, isSelected && styles.selectedText]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    radioLabel: {
        marginLeft: 5,
        marginRight: 10,
        color: COLOR.WHITE,
    },
    selectedText: {
        fontWeight: 'bold',
    },
    radioChecked: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 5,
        borderColor: COLOR.PRIMARY,
        // backgroundColor: '#000',
    },
    radioUnchecked: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLOR.PRIMARY,
        // backgroundColor: 'white',
    },
});

export default RadioButtonGroup;


// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
// import { COLOR } from '../common/typography';

// const RadioButtonGroup = ({ options, defaultValue, onValueChange }) => {
//     console.log("🔹 API Response (default_1):", defaultValue);

//     const isDarkMode = useColorScheme() === 'dark';

//     // Ensure defaultValue is correctly handled
//     const [checked, setChecked] = useState(defaultValue === true ? "true" : "false");

//     useEffect(() => {
//         console.log("🔄 Updating Checked State:", defaultValue);
//         setChecked(defaultValue === true ? "true" : "false");
//     }, [defaultValue]);

//     console.log("🔹 Checked State (default_2):", checked);

//     const handlePress = (value) => {
//         setChecked(value);
//         onValueChange(value === "true"); // Convert back to boolean
//     };

//     return (
//         <View style={styles.radioContainer}>
//             {options.map((option) => {
//                 const isSelected = checked === option.value;
                
//                 return (
//                     <TouchableOpacity
//                         key={option.value}
//                         onPress={() => handlePress(option.value)}
//                         style={styles.radioButton}
//                     >
//                         <View style={isSelected ? styles.radioChecked : styles.radioUnchecked} />
//                         <Text style={[styles.radioLabel, isSelected && styles.selectedText]}>
//                             {option.label}
//                         </Text>
//                     </TouchableOpacity>
//                 );
//             })}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     radioContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     radioButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginVertical: 5,
//     },
//     radioLabel: {
//         marginLeft: 5,
//         marginRight: 10,
//         flexDirection: 'column',
//         color: COLOR.WHITE, // Default text color
//     },
//     selectedText: {
//         fontWeight: 'bold', // Highlight selected option
//     },
//     radioChecked: {
//         height: 20,
//         width: 20,
//         borderRadius: 10,
//         borderWidth: 5,
//         borderColor: COLOR.PRIMARY,
//         // backgroundColor: '#000', // Ensure it's filled when selected
//     },
//     radioUnchecked: {
//         height: 20,
//         width: 20,
//         borderRadius: 10,
//         borderWidth: 2,
//         borderColor: COLOR.PRIMARY,
//         // backgroundColor: 'white', // Ensure it's empty when not selected
//     },
// });

// export default RadioButtonGroup;


// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
// import { COLOR } from '../common/typography';

// const RadioButtonGroup = ({ options, defaultValue, onValueChange }) => {
//     console.log("default_1", defaultValue);
//     const isDarkMode = useColorScheme() === 'dark';
//     const [checked, setChecked] = useState(defaultValue);
//     console.log("default_2", checked);

//     const circleColor = {
//         borderColor: isDarkMode ? COLOR.PRIMARY : COLOR.BLACK,
//         color: isDarkMode ? COLOR.WHITE : COLOR.BLACK,
//     };

//     useEffect(() => {
//         setChecked(defaultValue);
//     }, [defaultValue])

//     const handlePress = (value) => {
//         setChecked(value);
//         onValueChange(value);
//     };

//     return (
//         <View style={styles.radioContainer}>
//             {options.map((option) => (
//                 <TouchableOpacity
//                     key={option.value}
//                     onPress={() => handlePress(option.value)}
//                     style={styles.radioButton}
//                 >
//                     <View style={checked === option.value ? [styles.radioChecked, circleColor] : [styles.radioUnchecked, circleColor]} />
//                     <Text style={[styles.radioLabel, circleColor]}>{option.label}</Text>
//                 </TouchableOpacity>
//             ))}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     radioContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     radioButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginVertical: 5,
//     },
//     radioLabel: {
//         marginLeft: 5,
//         marginRight: 10,
//         flexDirection: 'column'
//     },
//     radioChecked: {
//         height: 20,
//         width: 20,
//         borderRadius: 10,
//         borderWidth: 5,
//         borderColor: '#000',
//     },
//     radioUnchecked: {
//         height: 20,
//         width: 20,
//         borderRadius: 10,
//         borderWidth: 2,
//         borderColor: '#000',
//     },
// });

// export default RadioButtonGroup;