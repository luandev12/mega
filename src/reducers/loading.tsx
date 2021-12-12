const initialValue = false
const Index = (state = initialValue, action) => {

  switch (action.type) {
    case "LOADING":
      
      return action.payload
  
    default:
      return state
  }
}

export default Index