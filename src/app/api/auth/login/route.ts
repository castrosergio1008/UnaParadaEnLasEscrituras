import { createToken } from "@/lib/auth"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return Response.json({ error: "Credenciales inválidas" }, { status: 401 })
  }

  const token = createToken(email)

  return Response.json({ token, email })
}
