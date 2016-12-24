module Network exposing (..)

import Json.Decode exposing (..)
import Types exposing (..)
import Http


getProfile : String -> Cmd Msg
getProfile email =
    Http.get ("http://localhost:7003/search?email=" ++ email) responseDecoder
        |> Http.send JsonResponse


userDecoder : Decoder User
userDecoder =
    map3 User
        (at [ "response", "user", "login", "$" ] string)
        (at [ "response", "user", "email", "$" ] string)
        (at [ "response", "user", "id", "$" ] int)


notFoundDecoder : Decoder User
notFoundDecoder =
    map3 User
        (succeed "-----")
        (succeed "-----")
        (succeed 0)


responseDecoder : Decoder User
responseDecoder =
    oneOf [ userDecoder, notFoundDecoder ]
