import React from 'react';
import { StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const CustomDropDownPicker = ({
  open,
  value,
  items,
  setOpen,
  setValue,
  setItems,
  placeholder,
  zIndex,
  onSelectItem,
  arrowIconStyle,
  min,
  maxHeight,
  search
}) => {
  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      placeholder={placeholder}
      // zIndex={zIndex}
      onSelectItem={onSelectItem}
      arrowIconStyle={arrowIconStyle}
      min={min}
      maxHeight={maxHeight}
      searchable={search}
      // style={{ backgroundColor: "#fafafa",
      // borderColor: "#ccc",}}
      dropDownDirection="BOTTOM"
      style={styles.dropdown}
      dropDownContainerStyle={styles.dropdownContainer}
      zIndex={4000}
      zIndexInverse={1000}
      listMode="SCROLLVIEW"
    />
  );
};

export default CustomDropDownPicker;

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  dropdown: {
    backgroundColor: "#fafafa",
    borderColor: "#ccc",
  },
  dropdownContainer: {
    backgroundColor: "#fafafa",
    zIndex: 1000,
    position: 'relative',
    top: 0
  },
});

