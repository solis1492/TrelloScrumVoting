using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Script.Serialization;
using Microsoft.AspNet.SignalR;

namespace ScrumTrelloWeight
{
    public class CardHub : Hub
    {
        private static Dictionary<String, List<User>> _groupClientsWeights = new Dictionary<string, List<User>>();
        private static Dictionary<String, String> _usersGroups = new Dictionary<string, string>();
        private static Dictionary<String, String> _groupQuery = new Dictionary<string, string>();

        public void JoinRoom(string roomName)
        {
            Groups.Add(Context.ConnectionId, roomName);
            if (_groupClientsWeights.ContainsKey(roomName))
            {
                var user = new User
                {
                    Connection = Context.ConnectionId,
                    Weight = "",
                    HasVoted = false,
                    IsModerator = _groupClientsWeights[roomName].Count <= 0
                };

                _groupClientsWeights[roomName].Add(user);
                
                _usersGroups[Context.ConnectionId] = roomName;
                Clients.Caller.getCardFilter(_groupQuery[roomName]);
                Clients.Caller.IdentifyMe(false);
            }
            else
            {
                _groupClientsWeights[roomName] = new List<User>
                {
                    new User {Connection = Context.ConnectionId, Weight = "", IsModerator = true,HasVoted = false}
                };
                Clients.Caller.IdentifyMe(true);
                _groupQuery.Add(roomName,"Mountain Goat");
                _usersGroups.Add(Context.ConnectionId,roomName);
            }
            
            Reset(roomName);
        }

        public void SetCardFilter(string roomName, string query)
        {
            if (!_groupClientsWeights.ContainsKey(roomName)) return;

            if (_groupClientsWeights[roomName].First(x => x.Connection.CompareTo(Context.ConnectionId) == 0).IsModerator)
            {
                _groupQuery[roomName] = query;
                Clients.Group(roomName, Context.ConnectionId).getCardFilter(_groupQuery[roomName]);
            }
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            if (_usersGroups.ContainsKey(Context.ConnectionId))
            {
                var roomName = _usersGroups[Context.ConnectionId];
                var user = _groupClientsWeights[roomName].First(x => x.Connection.CompareTo(Context.ConnectionId) == 0);
                _groupClientsWeights[roomName].Remove(user);
                _usersGroups.Remove(Context.ConnectionId);
                var roomValues = _groupClientsWeights[roomName];
                if (roomValues.TrueForAll(u => u.HasVoted))
                {
                    Clients.Group(roomName).getWeights(roomValues.Select(u => u.Weight).ToList());
                }
                else
                {
                    Clients.Group(roomName).getPlaceHolders(roomValues.Count);
                }
            }
            
            return base.OnDisconnected(stopCalled);
        }

        public void Reset(string roomName)
        {
            if (!_groupClientsWeights.ContainsKey(roomName)) return;

            if (_groupClientsWeights[roomName].First(x => x.Connection.CompareTo(Context.ConnectionId)==0).IsModerator)
            {
                _groupClientsWeights[roomName].ForEach(x => x.HasVoted = false );
                _groupClientsWeights[roomName].ForEach(x => x.Weight = "");
            }
            Clients.Group(roomName).getPlaceHolders(GetAmountVotes(roomName));
        }

        public void Show(string roomName)
        {
            if (!_groupClientsWeights.ContainsKey(roomName)) return;
            if (_groupClientsWeights[roomName].First(x => x.Connection.CompareTo(Context.ConnectionId) == 0).IsModerator)
            {
                Clients.Group(roomName).getWeights(GetValuesFromRoom(roomName));
            }
            
        }

        public void Vote(string roomName, string weight)
        {
            var userIndex = _groupClientsWeights[roomName].FindIndex(u => u.Connection == Context.ConnectionId);
            if (_groupClientsWeights[roomName][userIndex].HasVoted) return;
            _groupClientsWeights[roomName][userIndex].HasVoted = true;
            _groupClientsWeights[roomName][userIndex].Weight = weight;
            var roomValues = _groupClientsWeights[roomName];
            if (roomValues.TrueForAll(user => user.HasVoted))
            {
                Clients.Group(roomName).getWeights(roomValues.Select(user => user.Weight).ToList());
            }
            else
            {
                Clients.Group(roomName).getPlaceHolders(roomValues.Count);
            }
        }

        public void GetVotes(string roomName)
        {
            if (_groupClientsWeights[roomName].First(x => x.Connection.CompareTo(Context.ConnectionId) == 0).IsModerator)
            {
                Clients.Group(roomName).getWeights(GetValuesFromRoom(roomName));
            }
        }

        private List<String> GetValuesFromRoom(string room)
        {
            return _groupClientsWeights[room].Select(user => user.Weight).ToList();
        }

        private int GetAmountVotes(string room)
        {
            return _groupClientsWeights[room].Select(user => user.Weight).ToList().Count;
        }
    }

    public class User
    {
        public string Connection { get; set; }
        public string Weight { get; set; }
        public bool IsModerator { get; set; }
        public bool HasVoted { get; set; }

    }



}