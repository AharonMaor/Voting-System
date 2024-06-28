import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import Candidate from "../components/CandidateCard";
import TimesUp from "./TimesUp";

export default function Vote({ role, contract, web3, currentAccount }) {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [vote, setVote] = useState(null);
  const [electionState, setElectionState] = useState(0);
  const [flag, setFlag] = useState(true);
  const [remainingTime, setRemainingTime] = useState(10 * 60); // 10 minutes in seconds
  const [questionAnswers, setQuestionAnswers] = useState({
    politicalOrientation: "",
    legalRevolution: "",
    economicSystem: ""
  });



  const getCandidates = async () => {
    if (contract) {
      const count = await contract.methods.candidatesCount().call();
      const temp = [];
      for (let i = 0; i < count; i++) {
        const candidate = await contract.methods.getCandidateDetails(i).call();
        temp.push({ name: candidate[0], votes: candidate[1] });
      }
      setCandidates(temp);
    }
  };

  const voteCandidate = async (candidate) => {
    try {
      if (contract) {
        await contract.methods.vote(candidate).send({ from: currentAccount });
        getCandidates();
        setFlag(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getElectionState = async () => {
    if (contract) {
      const state = await contract.methods.electionState().call();
      setElectionState(parseInt(state));
    }
  };

  useEffect(() => {
    getElectionState();
    getCandidates();
  }, [contract]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);
  
const handleVoteSubmit = () => {
    setFlag(false); // Set flag to true when "Submit Vote" is clicked
  }

  const handleVoteChange = (event) => {
    setVote(event.target.value);
  };

  const handleQuestionAnswer = (question, answer) => {
    setQuestionAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question]: answer
    }));
  };

  const handleVote = (event) => {
    event.preventDefault();
    if (!vote) {
      // Automatically vote based on the question answers
      const { politicalOrientation, legalRevolution, economicSystem } = questionAnswers;
      if (
        (politicalOrientation === "Right" || legalRevolution === "Yes" || economicSystem === "Capitalist") &&
        (Object.values(questionAnswers).filter((answer) => answer !== "").length >= 2)
      ) {
        voteCandidate(0); // Vote for 'Benjamin Netanyahu'
      } else if (
        (politicalOrientation === "Left" || legalRevolution === "No" || economicSystem === "Socialist") &&
        (Object.values(questionAnswers).filter((answer) => answer !== "").length >= 2)
      ) {
        voteCandidate(1); // Vote for 'Yair Lapid'
      } else {
        // The voter didn't meet the conditions for automatic voting
        console.log("Cannot automatically vote based on the question answers.");
      }
    } else {
      voteCandidate(vote);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Box>
      <form onSubmit={handleVote}>
        <Grid container sx={{ mt: 0 }} spacing={6} justifyContent="center">
          <Grid item xs={12}>
            <Typography align="center" variant="h6">
              {electionState === 0 && "Please Wait... Election has not started yet."}
              {electionState === 1 && flag && "VOTE FOR YOUR FAVOURITE CANDIDATE"}
              {electionState === 1 && !flag && "THANKS FOR VOTING"}
              {electionState === 2 && "Election has ended. See the results below."}
            </Typography>
            {electionState === 1 && (flag) && (
              <>
                {remainingTime >= 0 && 
                <Typography align="center" variant="h6">
                  Remaining Time: {formatTime(remainingTime)}
                </Typography>}
                {remainingTime < 0 && (<TimesUp/>)}
              </>
            )}
            <Divider />
          </Grid>
          {electionState === 1 && (remainingTime>=0) && (flag) &&(
            <>
              <Grid item xs={12}>
                <FormControl>
                  <RadioGroup
                    row
                    sx={{
                      overflowY: "hidden",
                      overflowX: "auto",
                      display: "flex",
                      width: "98vw",
                      justifyContent: "center"
                    }}
                    value={vote}
                    onChange={handleVoteChange}
                  >
                    {candidates.map((candidate, index) => (
                      <FormControlLabel
                        key={index}
                        labelPlacement="top"
                        control={<Radio />}
                        value={index}
                        label={<Candidate id={index} name={candidate.name} />}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
              <Typography align="center" variant="h6">
              If you don't know who to vote for, let us help you (Anonymous choice according to your principles) :
              </Typography>
                <FormControl component="fieldset" >
                  <FormLabel component="legend" textAlign= 'center'>Question 1: Do you define yourself right-wing or left-wing politics?</FormLabel>
                  <RadioGroup
                    row
                    aria-label="politicalOrientation"
                    name="politicalOrientation"
                    value={questionAnswers.politicalOrientation}
                    onChange={(e) => handleQuestionAnswer("politicalOrientation", e.target.value)}
                  >
                    <FormControlLabel value="Right" control={<Radio />} label="Right" />
                    <FormControlLabel value="Left" control={<Radio />} label="Left" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Question 2: Are you in favor of the legal revolution?</FormLabel>
                  <RadioGroup
                    row
                    aria-label="legalRevolution"
                    name="legalRevolution"
                    value={questionAnswers.legalRevolution}
                    onChange={(e) => handleQuestionAnswer("legalRevolution", e.target.value)}
                  >
                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Question 3: Are you a capitalist or a socialist?</FormLabel>
                  <RadioGroup
                    row
                    aria-label="economicSystem"
                    name="economicSystem"
                    value={questionAnswers.economicSystem}
                    onChange={(e) => handleQuestionAnswer("economicSystem", e.target.value)}
                  >
                    <FormControlLabel value="Capitalist" control={<Radio />} label="Capitalist" />
                    <FormControlLabel value="Socialist" control={<Radio />} label="Socialist" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" onClicked={handleVoteSubmit} sx={{ width: "100%" }}>
                  Submit Vote
                </Button>
              </Grid>
            </>
          )}
          {electionState === 2 && (
            <>
              <Grid item xs={12}>
                <Typography align="center" variant="h6">
                  Election Results
                </Typography>
                <Divider />
              </Grid>
              {candidates.map((candidate, index) => (
                <Grid key={index} item xs={12}>
                  <Typography variant="h6">{candidate.name}</Typography>
                  <Typography variant="subtitle1">Votes: {candidate.votes}</Typography>
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </form>
    </Box>
  );
}
