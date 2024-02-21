import { roles } from "../../middleware/auth.js"

const categoryEndPoints={
    create:["Admin"],
    update:[roles.Admin]
}

export default categoryEndPoints