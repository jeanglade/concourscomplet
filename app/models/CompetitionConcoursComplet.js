class CompetitionConcoursComplet {
  GuidCompetition; // As Guid
  DateDebutCompetition; // As Date?
  NomCompetition; // As String
  UtilisationMonteeBarre; // As Boolean
  UseAnemometre; // As Boolean
  EpreuveConcoursComplet; // As EpreuveConcoursComplet
}

/*VB
    Public Function SerializeJson(fileName As String) As ResultStructure
        Dim result As ResultStructure = New ResultStructure
        result.isOk = True
        Try
            'File.WriteAllText("D:\TestNew.json", JsonConvert.SerializeObject(Me, Formatting.Indented, New JsonSerializerSettings With {.PreserveReferencesHandling = PreserveReferencesHandling.All}))

            Dim serializer As JsonSerializer = New JsonSerializer()
            serializer.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore
            serializer.TypeNameHandling = Newtonsoft.Json.TypeNameHandling.Auto
            serializer.Formatting = Newtonsoft.Json.Formatting.Indented
            serializer.PreserveReferencesHandling = PreserveReferencesHandling.Objects
            'Ajouter pour le cas des interclubs !! A Conserver ?
            serializer.ReferenceLoopHandling = ReferenceLoopHandling.Serialize
            serializer.ObjectCreationHandling = ObjectCreationHandling.Replace
            Using sw As StreamWriter = New StreamWriter(fileName)
                Using writer As Newtonsoft.Json.JsonWriter = New Newtonsoft.Json.JsonTextWriter(sw)
                    serializer.Serialize(writer, Me, GetType(Competition))
                End Using
            End Using

        Catch ex As Exception
            result.isOk = False
            result.ErrorTxt = ex.Message
            My.Application.Log.WriteEntry(Now & "-" & ex.Message & vbCrLf & ex.StackTrace)
        End Try
        Return result
    End Function*/
