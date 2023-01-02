type Sport = {
  idSport: string;
  strFormat: string;
  strSport: string;
  strSportDescription: string;
  strSportIconGreen: string;
  strSportThumb: string;
};

const getSports = async () => {
  const res = await fetch(
    "https://www.thesportsdb.com/api/v1/json/2/all_sports.php"
  );

  const data = await res.json();

  const sportsList: string[] = [];

  data.sports.map((sport: Sport) => sportsList.push(sport.strSport));
  return sportsList;
};

export default getSports;
