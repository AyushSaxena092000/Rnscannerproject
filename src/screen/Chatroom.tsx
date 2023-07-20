import React, {useState, useRef} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Scanner from './Scanner';
import {format} from 'date-fns';

interface T {
  type: string;
  text: string;
  time: string;
  date: string;
}

const Chatroom: React.FC = ({}: any) => {
  const [inputText, setInputText] = useState('');
  const [data, setData] = useState<Array<T>>([]);
  const [imageData, setImageData] = useState('');
  const [isInputEmpty, setIsInputEmpty] = useState(true);

  const refRBSheet = useRef<RBSheet>(null);
  const apiKey = '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';
  const apiUrl =
    'https://api.openai.com/v1/engines/text-davinci-002/completions';

  let temp = '';
  const getDate = (date: string) => {
    let bool = false;

    if (temp === '' || temp !== date) {
      bool = true;
      temp = date;
    } else {
      bool = false;
    }

    return bool;
  };

  const handleDataReceived = (data: any) => {
    setImageData(data.path);
    console.log('image in chatroom--->', data.path);
    if (refRBSheet.current) {
      refRBSheet.current.close();
    }
  };

  const handleSend = async () => {
    const prompt = inputText;
    const response = await axios.post(
      apiUrl,
      {
        prompt: prompt,
        max_tokens: 1024,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    const text = response.data.choices[0].text;

    setData([
      ...data,
      {type: 'user', text: inputText, time: formattedTime, date: formattedDate},
      {type: 'bot', text: text, time: formattedTime, date: formattedDate},
    ]);
    setInputText('');
    console.log('set data --> ', data);
  };

  const currentDateTime = new Date();
  const formattedDate = format(currentDateTime, 'dd . MM . yy');
  const formattedTime = format(currentDateTime, 'hh:mm a');
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/arror.png')}
          style={styles.headerImage}
        />
        <Text style={styles.headerText}>Chatroom</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <SafeAreaView style={styles.areaView}>
          <FlatList
            data={data}
            keyExtractor={(_item, index) => index.toString()}
            renderItem={({item}) => (
              <>
                {getDate(item.date) && (
                  <View style={styles.dateContainer}>
                    <View style={styles.hrLine} />
                    <Text style={styles.dateText}>{item.date}</Text>
                    <View style={styles.hrLine} />
                  </View>
                )}
                <View
                  style={[
                    styles.chatItemContainer,
                    item.type === 'user' && dynamicStyles.chatItemContainerUser,
                  ]}>
                  <View style={styles.ViewChat}>
                    {item.type === 'user' && (
                      <View style={styles.senderView}>
                        <Text style={styles.senderTime}>{item.time}</Text>
                      </View>
                    )}
                    <View style={styles.messageBubble}>
                      {item.type === 'user' ? (
                        <View style={styles.userView}>
                          <Text
                            style={[
                              styles.messageText,
                              item.type === 'user'
                                ? dynamicStyles.userMessageText
                                : dynamicStyles.botMessageText,
                            ]}>
                            {item.text}
                          </Text>
                          <View>
                            <Image
                              source={require('../assets/next.png')}
                              style={styles.nextImage}
                            />
                          </View>
                        </View>
                      ) : (
                        <View style={styles.userView}>
                          <View>
                            <Image
                              source={require('../assets/previous.png')}
                              style={styles.previousImage}
                            />
                          </View>
                          <Text
                            style={[
                              styles.messageText,
                              item.type === 'user'
                                ? dynamicStyles.userMessageText
                                : dynamicStyles.botMessageText,
                            ]}>
                            {item.text}
                          </Text>
                        </View>
                      )}
                    </View>
                    {item.type === 'bot' && (
                      <View style={styles.receviverTimeView}>
                        <Text style={styles.receiverTime}>{item.time}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </>
            )}
          />
        </SafeAreaView>
      </ScrollView>
      {imageData && (
        <View style={styles.imageData}>
          <Image
            source={{
              uri: `${imageData}`,
            }}
            style={styles.imageDataImage}
          />
        </View>
      )}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() => refRBSheet.current?.open()}
          onClose={() => setInputText('')}
          style={styles.addButton}>
          <Image
            source={require('../assets/add.png')}
            style={styles.addImage}
          />
          <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            customStyles={{
              wrapper: {
                backgroundColor: 'transparent',
              },
              draggableIcon: {
                backgroundColor: '#000',
              },
            }}>
            <Scanner onDataScanned={handleDataReceived} />
          </RBSheet>
        </TouchableOpacity>
        <TextInput
          multiline={true}
          style={styles.input}
          placeholder="Message.."
          value={inputText}
          onChangeText={text => {
            setInputText(text);
            setIsInputEmpty(text === '');
          }}
        />
        <TouchableOpacity
          onPress={handleSend}
          style={[
            styles.sendButton,
            isInputEmpty && {backgroundColor: undefined},
          ]}
          disabled={isInputEmpty}>
          <Image
            source={require('../assets/send.png')}
            style={styles.sendImage}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    flex: 2,
    backgroundColor: '#EEEFF6',
  },
  header: {
    alignItems: 'center',
    marginTop: 25,
    width: '100%',
    height: 50,
    flexDirection: 'row',
  },
  headerImage: {
    width: 24,
    height: 24,
    marginLeft: 18,
    resizeMode: 'contain',
  },
  headerText: {
    color: '#000000',
    fontSize: 18,
    marginLeft: 115,
  },
  scrollView: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#EEEFF6',
  },
  messageContainer: {
    flex: 1,
  },
  addButton: {
    marginLeft: 20,
    marginRight: 5,
  },
  addImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    paddingBottom: 35,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingVertical: 5,
    width: '100%',
    height: 'auto',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 20,
    paddingTop: 3,
    paddingLeft: 15,
    paddingBottom: 0,
    width: 20,
  },
  sendButton: {
    marginLeft: 10,
    marginRight: 20,
    backgroundColor: 'blue',
  },
  sendImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    paddingBottom: 35,
  },
  senderTime: {
    color: '#8A8A8A',
    fontSize: 12,
    marginRight: 8,
    marginBottom: 0,
  },
  previousImage: {
    width: 20,
    height: 20,
    top: 8,
    marginRight: -4,
    resizeMode: 'contain',
  },
  messageBubble: {
    maxWidth: '83%',
    fontSize: 16,
    marginTop: 1,
  },
  messageText: {
    color: '#FFFFFF',
    paddingLeft: 12,
    paddingBottom: 8,
    paddingRight: 12,
    borderRadius: 5,
    paddingTop: 8,
    marginLeft: 0,
  },
  messageImage: {
    width: 240,
    height: 220,
    marginTop: 0,
    marginLeft: -7,
    borderRadius: 4,
  },
  nextImage: {
    width: 18,
    height: 18,
    top: 10,
    marginLeft: -5,
    resizeMode: 'contain',
  },
  receiverTime: {
    color: '#8A8A8A',
    fontSize: 10,
    marginTop: 'auto',
    marginLeft: 12,
    marginBottom: 0,
  },
  receviverTimeView: {
    justifyContent: 'flex-start',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginLeft: -15,
    marginTop: 8,
    marginRight: -15,
  },
  hrLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#000000',
    marginHorizontal: 15,
    width: '55%',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '400',
    marginRight: 5,
    marginLeft: 5,
    lineHeight: 15,
  },
  areaView: {
    marginLeft: 11,
    marginRight: 10,
    marginTop: -3,
  },
  chatItemContainer: {
    alignItems: 'flex-start', // Default value
    marginTop: 5,
    width: '100%',
    marginLeft: 0,
  },
  ViewChat: {
    flexDirection: 'row',
    marginTop: 13,
    // width:'auto',
    //backgroundColor: 'red',
  },
  senderView: {justifyContent: 'flex-end'},
  userView: {flexDirection: 'row'},
  imageData: {
    height: 150,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageDataImage: {
    width: 150,
    height: 150,
    marginVertical: 5,
  },
});
const dynamicStyles = StyleSheet.create({
  chatItemContainerUser: {
    alignItems: 'flex-end',
  },
  userMessageText: {
    backgroundColor: '#051DFA',
    color: '#FFFFFF',
  },
  botMessageText: {
    backgroundColor: '#fff',
    color: '#0A0A0A',
  },
});

export default Chatroom;