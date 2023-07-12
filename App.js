import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Modal
} from "react-native";
// import ExpenseItem from "./screens/ExpenseItem";
import NetInfo from "@react-native-community/netinfo";
import ConnectToInternetModal from "./screens/ConnectToInternetModal";
import axios from "axios";
import Toast from "react-native-toast-message";

const App = () => {

  //variables
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [YourId, setYourId] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDataAvailable, setisDataAvailable] = useState(true);

  // To unsubscribe to these update, just use:
  const fetchExpenses = async () => {
    try {
      await axios
        .get("https://expense-tracker-room.onrender.com/expense")
        .then((res) => {
          const { status, data } = res.data;
          if (status === "success") {
            if(data.length == 0){
              alert("no data available")
            }
            setExpenses(data);
            setisDataAvailable(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isConnected = state.isConnected;
      setIsConnected(isConnected);
    });

    unsubscribe();
    //fetch al data
    fetchExpenses();
  }, []);

  const handleAddExpense = async () => {
    // Perform validation and add the expense
    // Example:
    if (!description || !amount) {
      Toast.show({
        type: "error",
        text1: "Please fill all details",
      });
      return;
    }

    let description1 = description;
    let amount1 = amount;
    setisDataAvailable(true);
    try {
      await axios
        .post("https://expense-tracker-room.onrender.com/getExpenses", {
          description1,
          amount1,
        })
        .then((response) => {
          // Clear input fields
          let { status, msg } = response.data;

          if (status == "Success") {
            Toast.show({
              type: "success",
              text1: msg,
            });
            setisDataAvailable(false);
          }

          setDescription("");
          setAmount("");
          fetchExpenses();
        })
        .catch((error) => {
          console.log(error);
        });
      // Fetch updated expenses
    } catch (error) {
      console.error(error);
    }
  };

  //add id 
  const onPressFunction = (item) => {
    setYourId(item)
    setIsDeleting(true);
  }

  //close modal
  const closeModal = () => {
    setIsDeleting(false)
  } 

  const deleteItem = async(item) =>{
    setisDataAvailable(true);
    let dlturl = "https://expense-tracker-room.onrender.com/deleteExpense/" + item;
    await axios
    .get(dlturl)
    .then((response) => {
      let { status, msg } = response.data;
      setIsDeleting(false);
      if (status == "success") {
        fetchExpenses();
        Toast.show({
          type: "success",
          text1: msg,
        });
        setisDataAvailable(false);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <View style={styles.container}>
      <ConnectToInternetModal visible={!isConnected} />

      <Text style={styles.titleMain}>Expense Tracker App</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => 
        <>
            <Pressable onPress={()=>onPressFunction(item._id)}>
              <View style={styles.containerData} >
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionText}>{item.description}</Text>
                </View>
                <Text style={styles.amountText}>₹{item.amount}</Text>
              </View>
          </Pressable>
      {isDeleting ?(
          <Modal visible={isDeleting} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.contentContainer}>
              <Text style={styles.title}>Delete Item</Text>
              <Text style={styles.subtitle}>Are you sure.</Text>
                <View style={styles.buttonArea}>
                  <TouchableOpacity style={styles.addButton} onPress={closeModal}>
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.addButtonDlt} onPress={()=>{deleteItem(YourId)}}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
            </View>
          </View>
          </Modal>
      ):null}
        </>
      
    }
      />
      <ActivityIndicator
        animating={isDataAvailable}
        size="large"
        color="#00ff00"
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.addButtonAdd} onPress={handleAddExpense}>
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  titleMain: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  addButtonAdd: {
    backgroundColor: "#3366FF",
    borderRadius: 8,
    paddingVertical: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  containerData: {
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

export default App;
