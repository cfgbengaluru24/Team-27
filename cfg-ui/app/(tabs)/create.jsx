import { useState, useEffect } from "react";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImageManipulator from 'expo-image-manipulator';
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import ImageResizer from 'react-native-image-resizer';
import axios from 'axios'
import { icons } from "../../constants";
import { createImagePost } from "../../lib/appwrite"; // Adjust this import to your actual API call
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [compressedImageUri, setCompressedImageUri] = useState(null);

  const [form, setForm] = useState({
    title: "",
    image: null,
    prompt: "",
  });

  // Handle network connectivity changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        // Call a function to upload images from local storage
        uploadStoredImages();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Store form data in local storage
  const storeImageLocally = async (data) => {
    try {
      const existingData = await AsyncStorage.getItem('pendingUploads');
      const parsedData = existingData ? JSON.parse(existingData) : [];
      parsedData.push(data);
      await AsyncStorage.setItem('pendingUploads', JSON.stringify(parsedData));
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  // Upload images stored locally
  const uploadStoredImages = async () => {
    try {
      const storedData = await AsyncStorage.getItem('pendingUploads');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        for (const item of parsedData) {
          var fd = new FormData();
          fd.append('image', {
          uri: item['image']['uri'],
          name: item['image']['name'] + 'offline_compressed_image.png',
          type: 'image/png',
        });
          // await createImagePost(item); // Adjust this to your actual API call
           await fetch('http://192.168.78.186:3000/upload-image', {
            method: 'POST',
            body: fd,
            // headers: { 'Content-Type': 'multipart/form-data' } // This header is set automatically
          });
          console.log("pending -> ", item)
          Alert.alert(JSON.stringify(item), "is uploaded!")
        }
        // Clear storage after uploading
        await AsyncStorage.removeItem('pendingUploads');
      }
    } catch (error) {
      console.error("Error uploading stored images", error);
    }
  };

  const openPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/png", "image/jpg", "image/jpeg"],
    });
    // console.log(result)
    const uri = result['assets'][0].uri
    console.log(uri)

    // i want to log the image size before and after

    if (!result.canceled) {
      setForm({ ...form, image: result['assets'][0] });
      try {
        const compressedImage = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 320, height: 180 } }],
          { compress: 0.5, format: ImageManipulator.SaveFormat.PNG }
        );
        setCompressedImageUri(compressedImage.uri);
        console.log(result['assets'][0])
        console.log(compressedImage)
        Alert.alert("Compression achieved upto ~50%")

        // now just call the API and upload all images.
      } catch (err) {
        console.error("Error compressing image", err);
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };
  const submit = async () => {
    if (!form.title || !form.image || !compressedImageUri) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    const data = {
      ...form,
      userId: user.$id,
    };

    try {
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        var the_url = ""
        var the_compressed_url = ""
        var description = ""
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('prompt', form.prompt);
        formData.append('image', {
          uri: form.image.uri,
          name: form.image.name || 'image.jpg',
          type: 'image/png',
        });

        // Assuming the compressed image should also be uploaded
        const formData2 = new FormData();
        formData2.append('image', {
          uri: compressedImageUri,
          name: form.image.name + 'compressed_image.png',
          type: 'image/png',
        });

        try {
          const response = await fetch('http://192.168.78.186:3000/upload-image', {
            method: 'POST',
            body: formData,
            // headers: { 'Content-Type': 'multipart/form-data' } // This header is set automatically
          });

          if (response.ok) {
            const result = await response.json();
            the_url = result.downloadURL
            Alert.alert("Success", "Post uploaded successfully");

          } else {
            const errorResult = await response.json();
            console.error('Upload failed:', errorResult);
            Alert.alert("Error", "Failed to upload the image");
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert("Error", error.message);
        }

        try {
          const response2 = await fetch('http://192.168.78.186:3000/upload-image', {
            method: 'POST',
            body: formData2,
            // headers: { 'Content-Type': 'multipart/form-data' } // This header is set automatically
          });

          if (response2.ok) {
            const result2 = await response2.json();
            Alert.alert("Success", "Post uploaded successfully");
            console.log("Take -> ", result2)
            the_compressed_url = result2.downloadURL
            router.push("/home");
          } else {
            const errorResult = await response2.json();
            console.error('Upload failed:', errorResult);
            Alert.alert("Error", "Failed to upload the image");
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert("Error", error.message);
        }
        description = form.title
        console.log(the_url, the_compressed_url, description)
        const dataToBackend = {
          "description": description,
          "url": the_url,
          "url_compressed": the_compressed_url,
          "activity_zone_id": 1
        }
        await fetch('http://192.168.78.186:3000/image_details', {
          method: 'POST',
          body: JSON.stringify(dataToBackend),
          headers: { 'Content-Type': 'application/json' } // This header is set automatically
        }).then((res) => {
          console.log("Pushed to backend")
        }).catch(err => {
          console.log(err.message)
        });

      } else {
        await storeImageLocally(data);
        Alert.alert("Saved", "Smart Sync enabled. Post will be uploaded when the internet is available");
      }
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        image: null,
        prompt: "",
      });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">
          Hello! Please upload your Image here!
        </Text>

        <FormField
          title="Image Title"
          value={form.title}
          placeholder="Give your image a title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Image
          </Text>

          <TouchableOpacity onPress={openPicker}>
            {form.image ? (
              <Image
                source={{ uri: form.image.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The AI prompt of your image...."
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
