import { TextInput, View, Text } from 'react-native';

export default function InputField({ label, value, onChange }: any) {
    return (
        <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, opacity: 0.6 }}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChange}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 6,
                    padding: 10,
                    marginTop: 4
                }}
            />
        </View>
    );
}