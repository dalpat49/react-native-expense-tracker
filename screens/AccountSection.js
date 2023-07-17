import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Appbar from './Appbar';

const AccountSection = () => {
  // Replace the following with your actual user data or use state management like Redux to retrieve user info
  const user = {
    username: 'JohnDoe',
    email: 'johndoe@example.com',
    profilePicture: require('../assets/images/profile_picture.png'),
  };

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user.username);

  const handleForgotPassword = () => {
    // Implement your "Forgot Password" logic here
    setShowForgotPasswordModal(true);
  };

  const handleEditProfile = () => {
    // Implement your "Edit Profile" logic here
    setShowEditProfileModal(true);
  };

  const handleSaveProfileChanges = () => {
    // Implement your "Save Profile Changes" logic here
    // For simplicity, we'll just update the state with the edited username
    setShowEditProfileModal(false);
  };

  const handleLogout = () => {
    // Implement your "Save Profile Changes" logic here
    // For simplicity, we'll just update the state with the edited username
    setShowEditProfileModal(false);
  };

  return (
    <>
      <Appbar title={"Your Account"} />
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={user.profilePicture} style={styles.profilePicture} />
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={handleForgotPassword}>
          <Text style={styles.optionButtonText}>Forgot Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={handleEditProfile}>
          <Text style={styles.optionButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.optionButtonLogout} onPress={handleLogout}>
          <Text style={styles.optionButtonTextLOGOUT}>Logout</Text>
        </TouchableOpacity>

      {/* Forgot Password Modal */}
      <Modal visible={showForgotPasswordModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Forgot Password</Text>
            {/* Implement your "Forgot Password" content here */}
            <Button title="Close" onPress={() => setShowForgotPasswordModal(false)} />
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal visible={showEditProfileModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.modalTextInput}
              value={editedUsername}
              onChangeText={(text) => setEditedUsername(text)}
            />
            <Button title="Save Changes" onPress={handleSaveProfileChanges} />
            <Button title="Cancel" onPress={() => setShowEditProfileModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  optionButtonLogout: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  optionButtonText: {
    fontSize: 16,
  },
  optionButtonTextLOGOUT: {
    fontSize: 16,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    margin: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    padding: 8,
  },
});

export default AccountSection;
