// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cfg_db.sqlite', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

module.exports = db;

import { useState, useEffect } from "react";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
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

import * as ImageManipulator from 'expo-image-manipulator';
import { icons } from "../../constants";
import { createImagePost } from "../../lib/appwrite"; // Adjust this import to your actual API call
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";