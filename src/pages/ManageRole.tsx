import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import * as service from '../services/roles.service';
import MyInput from '../components/MyInput';
import { Role } from "../model";
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";

export default function ManageRole() {

    const navigation = useNavigation<NavigationProp<any>>()
    const route = useRoute()

    let role: Role | null = null
    const params = route.params as { role?: Role }
    if (params && params.role) role = params.role

    const [name, setName] = React.useState(role ? role.name : '')
    const [description, setDescription] = React.useState(role ? role.description || '' : '')

    React.useEffect(() => {
        navigation.setOptions({ title: role ? 'Editar Role' : 'Nova Role' })
    }, [])

    function save() {
        if (name === '') {
            alert('Nome é requerido!');
            return;
        }

        if (role) {
            const editRole: Role = { id: role.id, name, description }

            service.update(editRole).then(success => {
                navigation.goBack()
            }).catch(error => {
                console.error('Erro ao alterar a role: ', error)
            })

        } else {
            const newRole: Role = { name, description }

            service.register(newRole).then(success => {
                navigation.goBack()
            }).catch(error => {
                console.error('Erro ao criar role: ', error)
            })
        }
    }

    return (
        <View style={styles.container}>
            <MyInput label="Nome" value={name} onChangeText={setName} />
            <MyInput label="Descrição" value={description} onChangeText={setDescription} />

            <View style={styles.buttonContainer}>
                <Button title="Salvar" onPress={save} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
    },
    buttonContainer: {
        width: '60%',
        marginTop: 20,
    },
});