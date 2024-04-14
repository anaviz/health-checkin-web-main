import React, { useState } from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";

const ResultCard = ({ title, result, description }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
      <Heading size="md" mb={2}>
        {title}
      </Heading>
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        {result}
      </Text>
      {expanded && <Text mb={2}>{description}</Text>}
      <Button size="sm" onClick={toggleExpand}>
        {expanded ? "Less Info" : "More Info"}
      </Button>
    </Box>
  );
};

export default ResultCard;
