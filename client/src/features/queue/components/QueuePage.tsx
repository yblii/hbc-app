import { useEffect, useState } from "react";
import type { Group, GroupCleanupData } from "../../../Types";
import { getGroups } from "../api/get-groups";
import { createGroup } from "../api/create-group";
import { useAuth0 } from "@auth0/auth0-react";
import GroupsList from "./GroupsList";
import { joinGroup } from "../api/join-group";
import { leaveGroup } from "../api/leave-group";
import JoinModal from "./JoinModal";
import CreateModal from "./CreateModal/CreateModal";

function QueuePage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(-1);

    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    useEffect(() =>  {
        const fetchGroups = async () =>  {
            try {
                const groups = await getGroups(getAccessTokenSilently);
                setGroups(groups);
            } catch(err) {
                console.log(err);
            }
        };

        fetchGroups();
    }, [getAccessTokenSilently]);

    const handleCreateGroup = async () => {
        setShowCreateGroupModal(false);
        if(!isAuthenticated) return;

        try {
            const { group, cleanup } = await createGroup(getAccessTokenSilently);
            setGroups(prevGroups => {
                const cleanedList = handleCleanup(cleanup, prevGroups);
                cleanedList.push(group);
                return cleanedList;
            });
        } catch(err) {
            console.log(err);
        }
    }

    const handleJoinGroup = async () => {
        setShowJoinGroupModal(false);
        if (selectedGroup === -1) return;

        try {
            const { group, cleanup } = await joinGroup(selectedGroup, getAccessTokenSilently);
            setGroups(prevGroups => {
                const cleanedList = handleCleanup(cleanup, prevGroups);
                return cleanedList.map(g => 
                    g.id === group.id ? group : g
                );
            });

        } catch(err) {
            console.log(err);
        }
    }

    const handleLeaveGroup = async (groupId: number) => {
        try {
            const cleanup = await leaveGroup(groupId, getAccessTokenSilently);
            if (!cleanup) return;    
            setGroups((prevGroups) => {
                return handleCleanup(cleanup, prevGroups);
            });
        } catch (err) {
            console.log(err);
        }
    }

    const showJoinGroup = (groupId: number) => {
        setSelectedGroup(groupId);
        setShowJoinGroupModal(true);
    }

    const handleCleanup = (cleanup: GroupCleanupData, currGroups: Group[]) => {
        let updatedList = [...currGroups];

        if(cleanup) {
            if(cleanup.type === 'DELETED') {
                updatedList = updatedList.filter(g => g.id !== cleanup.groupId);
            } else if(cleanup.type === 'UPDATED') {
                updatedList = updatedList.map(g =>
                    g.id === cleanup.group.id ? cleanup.group : g
                );
            }
        }
        return updatedList;
    }

    return (
        <div>
            <h1>Groups Page</h1>
            <GroupsList groups={groups} handleJoinGroup={showJoinGroup} handleLeaveGroup={handleLeaveGroup} />

            <button onClick={() => setShowCreateGroupModal(true)}>
                New Group
            </button>

            {showJoinGroupModal && <JoinModal handleJoinGroup={handleJoinGroup} closeModal={() => setShowJoinGroupModal(false)} />}
            {showCreateGroupModal && <CreateModal handleCreateGroup={handleCreateGroup} closeModal={() => setShowCreateGroupModal(false)} />}
        </div>
    )
}

export default QueuePage;