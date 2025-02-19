// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SurveyScreen from "./screens/SurveyScreen";
import AddSurveyLocation from "./screens/AddSurveyLocation";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SurveyScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SurveyScreen" component={SurveyScreen} />
        <Stack.Screen name="LocationAdd" component={AddSurveyLocation}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;