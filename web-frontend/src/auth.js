import { getApiUrl } from "./api"
import { useUserStore } from "./stores/user"

export async function authenticate(token) {
  try {
    const store = useUserStore()

    const request = await fetch(getApiUrl("/user/validate-token"), {
      method: "GET",
      headers: {
        Content_Type: "application/json",
        Authorization: "Bearer " + token,
      }
    })

    if (request.ok) {
      const response = await request.json()
      store.login(response.user)
    } else {
      store.logout()
    }
  } catch (error) {
    console.error("Error occured during authentication: " + error)
    store.logout()
  }

}