import React from "react";
import { Button, StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";

import * as service from '../services/user.service';
import * as rolesService from '../services/roles.service';
import MyInput from '../components/MyInput';
import { User, Role } from "../model";
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";

export default function UserPage() {

    const navigation = useNavigation<NavigationProp<any>>()
    const route = useRoute()

    let user: User | null = null
    const params = route.params as { user?: User }
    if (params && params.user) user = params.user

    const [name, setName] = React.useState(user ? user.name : '')
    const [username, setUsername] = React.useState(user ? user.username : '')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [availableRoles, setAvailableRoles] = React.useState<Role[]>([])
    const [selectedRoleIds, setSelectedRoleIds] = React.useState<string[]>(user ? user.roles || [] : [])

    React.useEffect(() => {
        navigation.setOptions({ title: user ? 'Editar Usuário' : 'Novo Usuário' })

        // Load available roles
        rolesService.getList().then(roles => {
            setAvailableRoles(roles)
        }).catch(error => {
            console.error('Erro ao carregar roles:', error)
        })
    }, [])

    function toggleRole(role: Role) {
        const roleId = role.id!.toString()
        const isSelected = selectedRoleIds.includes(roleId)

        if (isSelected) {
            setSelectedRoleIds(selectedRoleIds.filter(id => id !== roleId))
        } else {
            setSelectedRoleIds([...selectedRoleIds, roleId])
        }
    }

    function save() {
        if (name === '') {
            alert('Nome é requerido!');
            return;
        }
        if (user) {
            const editUser: User = { id: user.id, username, name, roles: selectedRoleIds }

            service.update(editUser).then(success => {
                navigation.goBack()
            }).catch(error => {
                console.error('Erro ao alterar o usuário: ', error)
            })

        } else {
            if (username === '') {
                alert('Login é requerido!');
                return;
            }
            if (password === '') {
                alert('Senha é requerida!');
                return;
            }
            if (password !== confirmPassword) {
                alert('Senhas não conferem!');
                return;
            }

            const newUser: User = { username, name, password, roles: selectedRoleIds }

            service.create(newUser).then(success => {
                navigation.goBack()
            }).catch(error => {
                console.error('Erro ao criar usuário: ', error)
            })
        }
    }

    const renderRole = ({ item }: { item: Role }) => {
        const roleId = item.id!.toString()
        const isSelected = selectedRoleIds.includes(roleId)

        return (
            <TouchableOpacity
                style={[styles.roleItem, isSelected && styles.selectedRole]}
                onPress={() => toggleRole(item)}
            >
                <Text style={[styles.roleText, isSelected && styles.selectedRoleText]}>
                    {item.name}
                </Text>
                {item.description && (
                    <Text style={[styles.roleDescription, isSelected && styles.selectedRoleDescription]}>
                        {item.description}
                    </Text>
                )}
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <MyInput label="Login" value={username} onChangeText={setUsername} readOnly={!!user} />
            <MyInput label="Nome" value={name} onChangeText={setName} />

            {!user && (
                <>
                    <MyInput label="Senha" onChangeText={setPassword} secureTextEntry />
                    <MyInput label="Confirmar Senha" onChangeText={setConfirmPassword} secureTextEntry />
                </>
            )}

            <View style={styles.rolesContainer}>
                <Text style={styles.rolesTitle}>Roles:</Text>
                <Text style={styles.rolesSubtitle}>
                    {selectedRoleIds.length} role(s) selecionada(s)
                </Text>
                <FlatList
                    data={availableRoles}
                    keyExtractor={role => role.id!.toString()}
                    renderItem={renderRole}
                    style={styles.rolesList}
                    showsVerticalScrollIndicator={false}
                />
            </View>

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
    rolesContainer: {
        width: '80%',
        marginBottom: 20,
    },
    rolesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    rolesSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    rolesList: {
        maxHeight: 200,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 5,
    },
    roleItem: {
        padding: 10,
        marginVertical: 2,
        backgroundColor: '#f8f9fa',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedRole: {
        backgroundColor: '#007bff',
        borderColor: '#0056b3',
    },
    roleText: {
        fontSize: 16,
        color: '#333',
    },
    selectedRoleText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    roleDescription: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    selectedRoleDescription: {
        color: '#e9ecef',
    },
});