<script lang="ts">
	import { apiFetch } from "$lib/scripts";
    import type { LoginData } from '$common/RequestTypes'
    import type { StatusResponse } from '$common/ResponseTypes'

    let username = ""
    let password = ""

    async function handleSubmit() {
        const body: LoginData = { username, password }
        const response = await apiFetch('/login',"POST", body)
        const json: StatusResponse = await response.json()
        console.log(json.status)
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <input type="text" bind:value={username}>
    <input type="password" bind:value={password}>
    <input type="submit">
</form>