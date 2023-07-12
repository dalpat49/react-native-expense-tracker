import React , {useState} from 'react';
import { View, Text, StyleSheet , RefreshControl, Pressable , Modal , TouchableOpacity} from 'react-native';
import axios from 'axios';
import Toast from "react-native-toast-message";
import App from '../App.js'


const ExpenseItem = ({ item }) => {

  const [isDeleting, setIsDeleting] = useState(false);
  const [YourId, setYourId] = useState(false);
  const [elementVisible, setElementVisible] = useState(false);

  const onPressFunction = () => {
    setIsDeleting(true);
  }
  //close modal
  const closeModal = () => {
    setIsDeleting(false)
  } 

  const deleteItem = async() =>{
    setYourId(item._id)
    let dlturl = "https://expense-tracker-room.onrender.com/deleteExpense/" + item._id;
    await axios
    .get(dlturl)
    .then((response) => {
      let { status, msg } = response.data;
      if (status == "success") {
        Toast.show({
          type: "success",
          text1: msg,
        });
        setIsDeleting(false)
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }
  
  return (
    <>
      <Toast />
      
        {/* <App getDataAsProp={YourId} style={styles.appSpecial} }/> */}

        <Pressable onPress={onPressFunction}>
          <View style={styles.container} >
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
            <Text style={styles.amountText}>₹{item.amount}</Text>
          </View>
        </Pressable>
    {/* //delete miodal */}
      <Modal visible={isDeleting} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Delete Item</Text>
            <Text style={styles.subtitle}>Are you sure.</Text>
              <View style={styles.buttonArea}>
                <TouchableOpacity style={styles.addButton} onPress={closeModal}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButtonDlt} onPress={deleteItem}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
          </View>
        </View>
      </Modal>
      </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionContainer: {
    flex: 1,
    marginRight: 16,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3366FF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: "#3366FF",
    width:100,
    marginVertical:6,
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4
    
  },
  addButtonDlt: {
    backgroundColor: "red",
    width:100,
    marginVertical:6,
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4
    
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonArea:{
    flexDirection: 'row',
    
  }
});

export default ExpenseItem;
