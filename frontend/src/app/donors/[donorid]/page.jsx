"use client";

// import React, { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import SimpleContainer from "./details"; // Assuming this component renders donor details
// import styles from "./styles.module.css";

// interface Donor {
//   donorid: number;
//   donorname: string;
//   dateofbirth: string;
//   bloodgroup: string;
//   location: string;
//   disease: string;
//   contact: string;
// }

// export default function DonorDetailsPage(): React.FC {
//   const [donor, setDonor] = useState<Donor | null>(null);
//   const params = useParams();

//   // ... rest of your code ...
//   useEffect(() => {
//     async function fetchDonor() {
//       try {
//         const donorId = params.donorid;

//         const response = await fetch(`http://localhost:3000/donors/${donorId}`);
//         console.log("response:", response); // Log the response for debugging

//         if (!response.ok) {
//           throw new Error("Failed to fetch donor details");
//         }

//         const donorData: Donor = await response.json(); // Type assertion for safety
//         setDonor(donorData);
//         // console.log(donor);
//       } catch (error) {
//         console.error("Error fetching donor details:", error);
//         // Handle errors in the UI (e.g., display an error message)
//       }
//     }

//     fetchDonor();
//   }, [params]);

//   return (
//     <div className={styles.details}>
//       {donor ? (
//         <>
//           <h1>{donor.donorname}</h1> {/* Access `donor` properties directly */}
//           {/* <SimpleContainer donor={donor} />{" "} */}
//           {/* Pass `donor` to SimpleContainer */}
//         </>
//       ) : (
//         <div>Loading...</div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import SimpleContainer from "./details"; // Assuming this component renders donor details
import styles from "./styles.module.css";

export default function DonorDetailsPage() {
  const [donor, setDonor] = useState(null);
  const params = useParams();

  useEffect(() => {
    async function fetchDonor() {
      try {
        const donorId = params.donorid;

        const response = await fetch(`http://localhost:3000/donors/${donorId}`);
        // console.log("response:", response); // Log the response for debugging

        if (!response.ok) {
          throw new Error("Failed to fetch donor details");
        }

        const donorData = await response.json();
        setDonor(donorData);
      } catch (error) {
        console.error("Error fetching donor details:", error);
        // Handle errors in the UI (e.g., display an error message)
      }
    }

    fetchDonor();
  }, [params]);
  return (
    <div className={styles.details}>
      {donor ? (
        <>
          <SimpleContainer donor={donor} />{" "}
          {/* Pass donor to SimpleContainer */}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
