const initialState = {
    current:null,
    isCreating:false,
    currentBox:null,
    currentMailBox:null,
    inbox:null,
    outbox:null,
    sended:null,
}

export const mailReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_BOX":
            if(action.payload.box=="inbox"){
                return { ...state, inbox: action.payload.mails }
            }
            if(action.payload.box=="outbox"){
                return { ...state, outbox: action.payload.mails }
            }
            if(action.payload.box=="sended"){
                return { ...state, sended: action.payload.mails }
            }
        case "SET_CURRENT_BOX":
            return  {...state,currentBox: action.payload.box,currentMailBox:action.payload.currentMailBox,current:null}
        case "SET_CURRENT":
            return { ...state, current: action.payload,isCreating:false };
            case "SET_CREATING_MAIL":
            return { ...state, isCreating: action.payload,current:null };
        case "SET_CURRENT_NULL":
            return initialState
        default:
            return state
    }
}

export default mailReducer;
