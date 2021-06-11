import { API_KEY, API_URL } from '@env'
import axios from 'axios'
import React, { useState } from 'react'
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native'
import MapView from 'react-native-maps'

const { width, height } = Dimensions.get('window')

export default function App() {
	const [location, setLocation] = useState(null)
	const [address, setAddress] = useState(null)

	function textHandler(text) {
		if (text.length === 8) {
			axios
				.get(`${API_URL}?cep=${text}`, {
					headers: { Authorization: `Token token=${API_KEY}` },
				})
				.then(({ data }) => {
					setLocation({ coords: { latitude: Number(data.latitude), longitude: Number(data.longitude) } })
					setAddress({ logradouro: data.logradouro, bairro: data.bairro, cidade: data.cidade, estado: data.estado })
				})
		}
	}

	return (
		<View style={styles.viewContainer}>
			<TextInput
				style={styles.TextInput}
				placeholder='informe seu cep'
				keyboardType='number-pad'
				onChangeText={textHandler}
			/>
			{address && <Text style={styles.text}>{JSON.stringify(address)}</Text>}
			<MapView
				provider='google'
				region={
					location
						? { ...location.coords, latitudeDelta: 0.0, longitudeDelta: 0.0 }
						: { latitude: -3.7440918, longitude: -38.4954941, latitudeDelta: 0.0, longitudeDelta: 0.0 }
				}
				style={styles.mapContainer}
				minZoomLevel={8}
				maxZoomLevel={14}
			>
				{location && (
					<MapView.Marker title='Meu marcador aqui' description='Apenas uma descricao' coordinate={location.coords} />
				)}
			</MapView>
		</View>
	)
}

const styles = StyleSheet.create({
	TextInput: {
		position: 'absolute',
		width: width - 30,
		backgroundColor: '#fff',
		zIndex: 999,
		top: 50,
		left: 10,
		right: 10,
		height: 40,
		padding: 8,
		borderRadius: 10,
		textAlign: 'center',
		fontSize: 20,
		borderWidth: 1,
		borderColor: '#a3a3a3',
	},
	text: {
		position: 'absolute',
		position: 'absolute',
		width: width - 30,
		backgroundColor: '#fff',
		zIndex: 999,
		top: 100,
		left: 10,
		right: 10,
		textAlign: 'center',
		padding: 4,
		borderRadius: 10,
	},
	viewContainer: {
		flex: 1,
	},
	mapContainer: {
		flex: 1,
	},
})
