module Types exposing (..)

import Http


type alias User =
    { login : String
    , email : String
    , id : Int
    }


type Msg
    = Fetch String
    | JsonResponse (Result Http.Error User)
    | UpdateFetchlist String
    | StartFetching
    | EmitCSV


type alias Model =
    { users : List User
    , error : String
    , fetchlist : String
    }
