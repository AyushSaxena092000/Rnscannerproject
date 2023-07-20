import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  View,
} from 'react-native';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';

const Scanner = ({
  onDataScanned,
}: {
  onDataScanned: (image: ImageOrVideo | null) => void;
}) => {
  const pickMultiple = () => {
    ImagePicker.openPicker({
      cropping: true,
    }).then((selectedImage: ImageOrVideo | null) => {
      if (selectedImage) {
        console.log(selectedImage.path);
        onDataScanned(selectedImage);
      }
    });
  };

  const chat = () => {
    console.log('clicked');
  };

  const pickCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
    }).then((selectedImage: ImageOrVideo | null) => {
      if (selectedImage) {
        console.log('camera', selectedImage.path);
        onDataScanned(selectedImage);
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView horizontal>
        <View style={styles.imgContainer}>
          <TouchableOpacity onPress={pickMultiple}>
            <Image
              source={require('../assets/gallery.png')}
              style={styles.previousImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.imgContainer}>
          <TouchableOpacity onPress={pickCamera}>
            <Image
              source={require('../assets/camera.png')}
              style={styles.previousImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.imgContainer}>
          <TouchableOpacity onPress={chat}>
            <Image
              source={require('../assets/chat.png')}
              style={styles.previousImage}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    marginBottom: 10,
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  safeArea: {
    marginTop: 20,
  },
  dateContainer: {
    flexDirection: 'row',
  },
  imgView: {
    width: '50%',
    marginVertical: 10,
  },
  selectbutton: {
    color: '#000000',
    margin: 7,
  },
  imgContainer: {
    marginHorizontal: 43,
  },
  previousImage: {
    width: 40,
    height: 40,
  },
});

export default Scanner;