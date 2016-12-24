port module Main exposing (..)

import Html exposing (..)
import Html.Events exposing (onClick, onInput)
import Html.Attributes exposing (placeholder, rows, cols, type_, class, id, for)
import Network exposing (..)
import Types exposing (..)


port emitCSV : String -> Cmd msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        JsonResponse (Ok stuff) ->
            ( { model | users = stuff :: model.users }, Cmd.none )

        JsonResponse (Err err) ->
            ( { model | error = toString err }, Cmd.none )

        Fetch email ->
            ( model, getProfile email )

        UpdateFetchlist fetchlist ->
            ( { model | fetchlist = fetchlist }, Cmd.none )

        StartFetching ->
            let
                cmds =
                    model.fetchlist |> String.split (",") |> List.map getProfile
            in
                ( model, Cmd.batch cmds )

        EmitCSV ->
            ( model, emitCSV <| parseUserList model.users )


userRow : User -> Html Msg
userRow user =
    tr []
        [ td [] [ text (toString user.id) ]
        , td [] [ text user.login ]
        , td [] [ text user.email ]
        ]


userTable : Model -> Html Msg
userTable model =
    if (List.length model.users) > 0 then
        table []
            [ thead []
                [ tr []
                    [ th [] [ text "ID" ]
                    , th [] [ text "Username" ]
                    , th [] [ text "Email" ]
                    ]
                ]
            , tbody [] (List.map userRow model.users)
            ]
    else
        div [] []


parseUserList : List User -> String
parseUserList userList =
    let
        parseUser : User -> String
        parseUser user =
            user.email ++ "," ++ user.login ++ "," ++ (toString user.id)
    in
        List.map parseUser userList
            |> String.join "\n"


view : Model -> Html Msg
view model =
    div [ id "main" ]
        [ h1 [] [ text model.error ]
        , div []
            [ textarea
                [ placeholder "Paste a comma-separated list of emails here"
                , onInput UpdateFetchlist
                ]
                []
            ]
        , div []
            [ button
                [ id "FetchButton"
                , onClick StartFetching
                ]
                [ text "Fetch Profiles" ]
            , button [ onClick EmitCSV ] [ text "Save File" ]
            ]
        , userTable model
        ]


main : Program Never Model Msg
main =
    Html.program
        { update = update
        , view = view
        , init = ( Model [] "" "", Cmd.none )
        , subscriptions = \_ -> Sub.none
        }
