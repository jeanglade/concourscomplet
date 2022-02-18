class AthleteConcoursComplet {
  GuidParticipant; //  As Guid
  Prenom; //  As String
  Nom; //  As String
  Categorie; //  As String
  Club; //  As String
  Nationalite; //  As String
  DateNaissance; //  As String
  Sexe; //  As String
  Dossard; //  As Integer?
  IsNew; //  As Boolean

  constructor(
    GuidParticipant,
    Prenom,
    Nom,
    Categorie,
    Club,
    Nationalite,
    DateNaissance,
    Sexe,
    Dossard,
    IsNew,
  ) {
    this.GuidParticipant = GuidParticipant;
    this.Prenom = Prenom;
    this.Nom = Nom;
    this.Categorie = Categorie;
    this.Club = Club;
    this.Nationalite = Nationalite;
    this.DateNaissance = DateNaissance;
    this.Sexe = Sexe;
    this.Dossard = Dossard;
    this.IsNew = IsNew;
  }
}
