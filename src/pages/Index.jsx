import { useState, useEffect } from "react";
import { Box, VStack, Text, Button, Heading, Flex, Spacer, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Select, Input, Collapse } from "@chakra-ui/react";
import { FaHome, FaChartBar, FaComments } from "react-icons/fa";
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const supabase = createClient(process.env.REACT_APP_PUBLIC_SUPABASE_URL, process.env.REACT_APP_PUBLIC_SUPABASE_ANON_KEY)

const ResultCard = ({ title, result, description }) => {
  const [show, setShow] = useState(false);

  const handleToggle = () => setShow(!show);

  return (
    <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
      <Heading size="md" mb={2}>
        {title}
      </Heading>
      <Text fontWeight="bold" mb={2}>
        {result}
      </Text>
      <Collapse startingHeight={20} in={show}>
        <Text mb={4}>{description}</Text>
      </Collapse>
      <Button size="sm" onClick={handleToggle} mt="1rem">
        {show ? "Less" : "More"} Info
      </Button>
    </Box>
  );
};

const AddModal = ({ isOpen, onClose, onAdd }) => {
  const [type, setType] = useState("Meal");
  const [text, setText] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>How are you today?</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Box as="span" fontSize="60px" color="gray.500" bg="gray.200" borderRadius="full" width="120px" height="120px" display="flex" alignItems="center" justifyContent="center">
            🎤
          </Box>
          <Text fontSize="sm" color="gray.500">
            Tap to speak
          </Text>
        </ModalBody>
        <ModalFooter>
          <Flex w="100%">
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." mr={2} />
            <Button colorScheme="blue" onClick={() => onAdd(text)}>
              Send
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
// Remove Supabase imports and initialization

const Index = () => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [score, setScore] = useState(0);
  const [activities, setActivities] = useState([]);
  const [results, setResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAdd = (text) => {
    console.log(`Adding: ${text}`);
    closeModal();
  };

  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setUser(session.user);
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setUser(session.user);
    })

    return () => subscription.unsubscribe();
  }, [])

  useEffect(() => {
    let ignore = false;
    async function getProfile(userId) {
      // setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select("*")
        .eq('id', userId);

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          if (data[0] && data[0].health_score) { setScore(data[0].health_score) };
          if (data[0] && data[0].activities) { setActivities(data[0].activities) };
          if (data[0] && data[0].epigenetic_results) { setResults(data[0].epigenetic_results) };
        }
      }
      // setLoading(false);
    }

    const userId = user? user.id : null;
    if (userId) {
      getProfile(userId);
    }

    return () => {
      ignore = true;
    }
  }, [session, user]);

  if (!session) {
    return (
      <Box p={4}>
        <Heading size="lg" mb={4}>
          Welcome!
        </Heading>
        <Text mb={4}>Please log in to access the app.</Text>
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa } } providers={[]}/>
      </Box>
    )
  }
  else {
    return (
      <Box maxW="600px" mx="auto" paddingBottom={16}>
        {page === "home" && (
          <VStack spacing={6} p={4}>
            <Heading size="lg" textAlign="center">
              Your Score
            </Heading>
            <Text fontSize="6xl" fontWeight="bold">
              {score}
            </Text>
            <Box w="100%">
              <Heading size="md" mb={2}>
                Latest Activities
              </Heading>
              {activities.length === 0 ? (
                <Text>Add your first activity</Text>
              ) : (
                activities.map((activity) => (
                  <Box key={activity.id} p={2} borderWidth={1} mb={2}>
                    <Text>{activity.name}</Text>
                  </Box>
                ))
              )}
            </Box>
          </VStack>
        )}

        {page === "results" && (
          <Box p={4}>
            <Heading size="lg" mb={4}>
              Results
            </Heading>
            {results.length === 0 ? (
                <Text>Your epigenetic results are getting processed</Text>
              ) : (
                results.map((result) => (
                  <ResultCard title={result.title} result={result.result} description={result.description} />
                ))
              )}
          </Box>
        )}

        <Button position="fixed" bottom="80px" right="20px" borderRadius="full" size="lg" colorScheme="blue" onClick={openModal} zIndex={2}>
          <FaComments />
        </Button>
        <Flex as="nav" align="center" justify="space-around" p={4} borderTopWidth={1} position="fixed" bottom={0} left={0} right={0} bg="white" zIndex={1}>
          <Button variant="ghost" onClick={() => setPage("home")}>
            <FaHome />
            <Text ml={2}>Home</Text>
          </Button>
          <Button variant="ghost" onClick={() => setPage("results")}>
            <FaChartBar />
            <Text ml={2}>Results</Text>
          </Button>
        </Flex>
        <AddModal isOpen={isModalOpen} onClose={closeModal} onAdd={handleAdd} />
      </Box>
    );
      }
};

export default Index;
