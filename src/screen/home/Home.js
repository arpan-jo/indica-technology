import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {useDispatch, useSelector} from 'react-redux';

import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {clearUser} from '../../redux/authSlice';

const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    auth: {name, fbToken},
  } = useSelector(state => state);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const subscribe = firestore()
      .collection('chatId')
      .onSnapshot(snapshot => {
        snapshot?.docChanges()?.forEach(change => {
          if (change?.type === 'added') {
            let datas = change?.doc?.data();
            datas.createdAt = datas.createdAt.toDate();
            setMessages(previousMessages =>
              GiftedChat.append(previousMessages, datas),
            );
          }
        });
      });

    return () => subscribe();
  }, []);

  const d = Date.now().toLocaleString();
  const onSend = async messagess => {
    await firestore().collection('chatId').doc(d).set(messagess?.[0]);
  };

  return (
    <View style={styles.main}>
      <View style={styles.head}>
        <Text>
          {name?.additionalUserInfo?.profile?.name ||
            fbToken?.additionalUserInfo?.profile?.name}
        </Text>

        <TouchableOpacity
          onPress={() => {
            dispatch(clearUser());
            navigation.navigate('Login');
          }}>
          <Text style={styles.logout}>Log Out</Text>
        </TouchableOpacity>
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id:
            name?.additionalUserInfo?.profile?.email ||
            fbToken?.additionalUserInfo?.profile?.id,
        }}
        timeTextStyle={{left: {color: 'red'}, right: {color: 'yellow'}}}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  button: {backgroundColor: 'red', padding: 10},
  main: {backgroundColor: 'white', flex: 1},
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  logout: {
    fontWeight: '600',
    fontSize: 16,
  },
});
